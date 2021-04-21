import {SigningKeyPair} from "@circlesland/auth-data/dist/signingKeyPair";
import {KeyRotatorState} from "@circlesland/auth-data/dist/type";
import {prisma_rw} from "@circlesland/auth-data/dist/prisma_rw";

export class KeyRotator {
    readonly _instanceId:string;
    static readonly checkInterval:number = 1000;
    readonly _signingKeyLifespan:number;

    /**
     * If this is currently active keyRotator.
     */
    get isActive() {
        return this._isActive;
    }
    private _isActive:boolean = false;

    constructor(instanceId:string, signingKeyLifespan:number) {
        this._instanceId = instanceId;
        this._signingKeyLifespan = signingKeyLifespan;

        setInterval(async () =>
        {
            // Check if there is already a valid KeyRotator (requested or active) in the system
            const now = new Date();
            const keyRotator = await prisma_rw.keyRotator.findFirst({
                where: {
                    validTo: {
                        gt: now
                    }
                }
            });

            if (keyRotator
                && keyRotator.instanceId != this._instanceId) {
                // There is already a keyRotator and its not me :(
                return;
            }

            if (keyRotator
                && keyRotator.instanceId == this._instanceId
                && keyRotator.state == KeyRotatorState.Active) {
                // I'm the key-rotator, keep it this way
                await prisma_rw.keyRotator.update({
                    where: {
                        id: keyRotator.id
                    },
                    data: {
                        validTo: new Date(now.getTime() + KeyRotator.checkInterval * 2)
                    }
                });

                // Fulfil the keyRotator's duty ..
                await KeyRotator._ensureValidKeyPair(this._signingKeyLifespan);
                return;
            }

            if (keyRotator
                && keyRotator.instanceId == this._instanceId
                && keyRotator.state == KeyRotatorState.Requested) {
                // I'm becoming the key-rotator
                await prisma_rw.keyRotator.update({
                    where: {
                        id: keyRotator.id
                    },
                    data: {
                        state: KeyRotatorState.Active,
                        validTo: new Date(now.getTime() + KeyRotator.checkInterval * 2)
                    }
                });
                return;
            }

            // None of the previous conditions matched,
            // request to become the key-rotator.
            await prisma_rw.keyRotator.create({
                data: {
                    instanceId: this._instanceId,
                    state: KeyRotatorState.Requested,
                    validTo: new Date(now.getTime() + KeyRotator.checkInterval * 2)
                }
            });
        }, KeyRotator.checkInterval);
    }

    /**
     * Checks if a valid key pair exists. If not, a new one is created.
     * @private
     */
    private static async _ensureValidKeyPair(keyLifespan:number) : Promise<Date>
    {
        let keyPair = await SigningKeyPair.findValidKey();
        if (!keyPair) {
            keyPair = await SigningKeyPair.createKeyPair(keyLifespan);
        }
        await SigningKeyPair.clearPrivateKeys();
        return keyPair.validTo;
    }
}