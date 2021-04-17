import jsonwebtoken from 'jsonwebtoken';
import fetch from "cross-fetch";

/**
 * This client can be used solely to verify JWT tokens that have been issued by this service.
 */
export class Client
{
  private readonly _issuer: string;
  private readonly _appId: string;

  private static _cacheLookupCounter = 0;
  private static readonly _maxCacheAgeInMs = 1000 * 60 * 60 * 24;
  private static readonly _cacheCleanupAfterXLookups = 1000;

  private static readonly _keyCache: {
    [kid:string]: {
      lastUsed: Date,
      key: any
    }
  } = {};

  private static async getKey(kid:string) : Promise<any>
  {
    Client._cacheLookupCounter++;

    if (Client._keyCache[kid]) {
      Client._keyCache[kid].lastUsed = new Date();
      return Client._keyCache[kid].key;
    }

    const downloadedKey = await fetch(kid).then((data: any) => data.json());

    if (Client._cacheLookupCounter % Client._cacheCleanupAfterXLookups == 0)
    {
      Client._cacheLookupCounter = 0;

      const minLastUsed = Date.now() - Client._maxCacheAgeInMs;
      Object.keys(Client._keyCache).forEach(kid => {
        if (Client._keyCache[kid].lastUsed.getTime() < minLastUsed) {
          delete Client._keyCache[kid];
        }
      });
    }

    Client._keyCache[kid] = {
      lastUsed: new Date(),
      key: downloadedKey
    };

    return downloadedKey;
  }

  constructor(appId: string, issuer: string)
  {
    this._issuer = issuer;
    this._appId = appId;
  }

  /**
   * Verifies the received token and returns the "sub" claim if successful.
   * @param jwt
   */
  public async verify(jwt: string)
  {
    const tokenPayload: any = jsonwebtoken.decode(jwt);

    // Check who issued the token
    if (typeof tokenPayload !== "object")
      throw new Error("Couldn't decode the jwt");

    let kid = tokenPayload.kid;
    if (!kid)
      throw new Error("No key id (kid) claim.")

    const key = await Client.getKey(kid);
    const pubKey = key.data.keys.publicKey;
    if (!pubKey)
      throw new Error("Couldn't fetch the public key to verify the jwt");

    const verifiedPayload = jsonwebtoken.verify(jwt, pubKey);
    if (!verifiedPayload)
      throw new Error("The received jwt couldn't be verified.")

    const iss = tokenPayload.iss;
    if (!iss)
      throw new Error("No issuer (iss) claim.");
    if (iss !== this._issuer)
      throw new Error("The issuer must match the _authUrl (is: " + iss + "; should be:" + this._issuer + ")");

    const aud = tokenPayload.aud;
    if (typeof aud !== "object")
      throw new Error("The audience (aud) must be an array.");

    const audAppId = aud[0];
    if (audAppId != this._appId)
      throw new Error("The audience of the received jwt doesn't match the configured appId. (is: " + audAppId + "; should be: " + this._appId + ")");

    const sub = tokenPayload.sub;
    if (!sub)
      throw new Error("No subject (sub) claim.");

    return tokenPayload;
  }
}
