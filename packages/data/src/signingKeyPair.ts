
import {KeyGenerator} from "@circlesland/auth-util/dist/keyGenerator";
import {prisma_ro} from "./prisma_ro";
import {prisma_rw} from "./prisma_rw";
import {newLogger} from "@circlesland/auth-util/dist/logger";

const logger = newLogger("/packages/data/src/signingKeyPair.ts");

export class SigningKeyPair
{
    public static async findPublicKeyById(id: number)
    {
        return await prisma_ro.signingKeyPairs.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                publicKeyPem: true,
                validTo: true,
                validFrom: true
            }
        });
    }

    public static async findValidKey()
    {
        const now = new Date();

        const validKeyPairs = await prisma_ro.signingKeyPairs.findMany({
                where: {
                    validFrom: {
                        lte: now
                    },
                    validTo: {
                        gt: now
                    }
                }
            }
        );

        if (validKeyPairs.length > 1)
        {
            throw new Error("There exists more than one valid key pair.");
        }
        if (validKeyPairs.length == 0)
        {
            return null;
        }
        return validKeyPairs[0];
    }

    public static async clearPrivateKeys() {
        const now = new Date();
        const result = await prisma_rw.signingKeyPairs.updateMany({
            where:{
                validTo: {
                    lte: now
                },
                privateKeyPem: {
                    not: ""
                }
            },
            data: {
                privateKeyPem: ""
            }
        });
        if (result.count > 0) {
            logger.log(`Removed ${result.count} private key with expired validTo date.`)
        }
    }

    public static async createKeyPair(lifespanInMilliseconds:number)
    {
        logger.log(`Creating a new keyPair with lifetime ${lifespanInMilliseconds} ..`)

        const newKeyPair = await KeyGenerator.generateRsaKeyPair();
        const now = new Date();
        const newKeyPairEntry = await prisma_rw.signingKeyPairs.create({
            data: {
                privateKeyPem: newKeyPair.privateKeyPem,
                publicKeyPem: newKeyPair.publicKeyPem,
                privateKeyJwk: newKeyPair.privateKeyJwk,
                publicKeyJwk: newKeyPair.publicKeyJwk,
                validFrom: now,
                validTo: new Date(now.getTime() + lifespanInMilliseconds)
            }
        });

        logger.log(`Creating a new keyPair with lifetime ${lifespanInMilliseconds} .. Done.`)

        return newKeyPairEntry;
    }
}
