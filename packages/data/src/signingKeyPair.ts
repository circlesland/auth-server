
import {KeyGenerator} from "@circlesland/auth-util/dist/keyGenerator";
import {prisma_ro} from "./prisma_ro";
import {prisma_rw} from "./prisma_rw";

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
                validTo: true
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

    public static async createKeyPair()
    {
        if (!process.env.KEY_ROTATION_INTERVAL)
            throw new Error("process.env.KEY_ROTATION_INTERVAL is not set!");

        const newKeyPair = await KeyGenerator.generateRsaKeyPair();
        const now = new Date();
        const newKeyPairEntry = await prisma_rw.signingKeyPairs.create({
            data: {
                privateKeyPem: newKeyPair.privateKeyPem,
                publicKeyPem: newKeyPair.publicKeyPem,
                privateKeyJwk: newKeyPair.privateKeyJwk,
                publicKeyJwk: newKeyPair.publicKeyJwk,
                validFrom: now,
                validTo: new Date(now.getTime() + (parseInt(process.env.KEY_ROTATION_INTERVAL) * 1000))
            }
        });

        return newKeyPairEntry;
    }
}
