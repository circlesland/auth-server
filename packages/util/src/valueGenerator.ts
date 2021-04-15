import crypto from "crypto";

export class ValueGenerator
{
    static generateRandomBase64String(length:number)
    {
        return crypto.randomBytes(length).toString('base64').substr(0, length);
    }

    static generateRandomUrlSafeString(length:number) {
        return ValueGenerator.generateRandomBase64String(length)
            .replace("+",".")
            .replace("/","_")
            .replace("=","-");
    }
}
