import {SigningKeyPair} from "@circlesland/auth-data/dist/signingKeyPair";

export class KeyRotator
{
    private _intervalHandle?:number;
    private _validTo?:Date;

    async start(invalidateEveryNSeconds: number)
    {
        if (this._intervalHandle)
        {
            throw new Error("The KeyRotator was already started.");
        }
        if (invalidateEveryNSeconds < 3600)
        {
            throw new Error("The minimum lifetime of key pairs must be 3600 seconds.")
        }

        this._validTo = await KeyRotator._ensureValidKeyPair();

        setInterval(async () =>
        {
          const now = new Date();

          // TODO: Add the "valid from" claim to the jwt and create overlapping keys
          if (!this._validTo || now < this._validTo) {
            return;
          }

          this._validTo = await KeyRotator._ensureValidKeyPair();
        }, 500);
    }

    stop()
    {
        // TODO: Find a way to correctly stop the nodejs timer
        if (!this._intervalHandle)
        {
            throw new Error("The KeyRotator wasn't running.")
        }
        clearInterval(this._intervalHandle);
        this._intervalHandle = undefined;
        this._validTo = undefined;
    }

    /**
     * Checks if a valid key pair exists. If not, a new one is created.
     * @private
     */
    private static async _ensureValidKeyPair() : Promise<Date>
    {
        let keyPair = await SigningKeyPair.findValidKey();
        if (!keyPair) {
           keyPair = await SigningKeyPair.createKeyPair();
        }
        return keyPair.validTo;
    }
}
