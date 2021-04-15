import {generateKeyPair, randomBytes} from "crypto";

export interface KeyPair
{
    privateKeyPem: string,
    privateKeyJwk: string,
    publicKeyPem: string
    publicKeyJwk: string
}

export class KeyGenerator
{
    static async generateRandomKey(lengthInBytes:number) {
      return randomBytes(lengthInBytes);
    }

    static async generateRsaKeyPair(keyLength: number = 2048)
    {
        return new Promise<KeyPair>((resolve, reject) =>
        {
            generateKeyPair('rsa',
                {
                    modulusLength: keyLength,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        //passphrase: 'top secret' // *optional*
                    }
                },
                (err, publicKeyPem, privateKeyPem) =>
                {
                    if (err)
                    {
                        reject(err);
                        return;
                    }

                    const privateKeyJwk = "none";// pem2jwk(privateKeyPem);
                    const publicKeyJwk = "none";// pem2jwk(publicKeyPem);

                    const multiFormatKeyPair = {
                        privateKeyPem,
                        privateKeyJwk: JSON.stringify(privateKeyJwk),
                        publicKeyPem,
                        publicKeyJwk: JSON.stringify(publicKeyJwk)
                    };

                    resolve(multiFormatKeyPair);
                });
        });
    }
}
