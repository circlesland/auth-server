import crypto from "crypto";

export class ChallengeGenerator
{
    static generate(length:number, alphabet:string)
    {
        this.checkAlphabet(alphabet);

        const randomBytes = crypto.randomBytes(length);
        let result = "";

        for (let i = 0; i < randomBytes.length; i++) {
            result += alphabet[randomBytes[i] % alphabet.length];
        }

        return result;
    }

    private static  _validAlphabets:{[alphabet:string]:boolean} = {};

    private static checkAlphabet(alphabet:string) {
        if (this._validAlphabets[alphabet]){
            return alphabet;
        }
        if (alphabet.length < 10) {
            throw new Error(`The alphabet must have at least 10 different characters.`);
        }
        if (alphabet.length > 255) {
            throw new Error(`The alphabet must not be greater than 255 characters.`);
        }
        const distinctCharacterMap:{[character:string]:boolean} = {};
        for (let i = 0; i < alphabet.length; i++) {
            const char = alphabet[i];
            if (distinctCharacterMap[char] !== undefined) {
                throw new Error(`The alphabet "${alphabet}" contains at least one repeating character at index ${i}: "${char}"`);
            }
            distinctCharacterMap[char] = true;
        }
        this._validAlphabets[alphabet] = true;
        return alphabet;
    }
}