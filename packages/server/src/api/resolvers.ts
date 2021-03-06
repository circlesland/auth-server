import {
  LoginResponse,
  MutationResolvers,
  QueryResolvers, VerifyResponse, Version
} from "../generated/graphql";
import {Challenge} from "@circlesland/auth-data/dist/challenge";
import {Mailer} from "@circlesland/auth-mailer/dist/mailer";
import jsonwebtoken from 'jsonwebtoken';
import {ValueGenerator} from "@circlesland/auth-util/dist/valueGenerator";
import {SigningKeyPair} from "@circlesland/auth-data/dist/signingKeyPair";
import {App} from "@circlesland/auth-data/dist/apps";
import {Template} from "@circlesland/auth-mailer/dist/template";
const packageJson = require("../../package.json");

export class Resolvers
{
  readonly queryResolvers: QueryResolvers;
  readonly mutationResolvers: MutationResolvers;

  static async getAppById(appId:string) :  Promise<{
    id: number
    appId: string
    appName: string | null
    appUrl: string | null
    appDescription: string | null
    appIcon: string | null
    appContact: string | null
    corsOrigins: string
    exchangeCodeUrl: string
    exchangeTokenUrl: string
    challengeLifetime: number
    tokenLifetime: number
    loginMailSubjectTemplate: string | null
    loginMailHtmlTemplate: string | null
    loginMailTxtTemplate: string | null
    loginWindowHtmlTemplate: string | null
  }> {
    const app = await App.findById(appId);

    if (!app)
      throw new Error("The app with the id '" + appId + "' couldn't be found.")

    return app;
  }

  constructor()
  {
    this.mutationResolvers = {
      loginWithPublicKey:  async (parent, {appId, publicKey}) => {
        const app = await Resolvers.getAppById(appId);
        const challenge = await Challenge.requestChallenge("publicKey", publicKey, app.appId, 8, app.challengeLifetime);
        if (!challenge.success)
        {
          return <LoginResponse>{
            success: false,
            errorMessage: challenge.errorMessage
          }
        }

        return <LoginResponse>{
          success: true,
          challenge: challenge.challenge,
        }
      },
      loginWithEmail: async (parent, {appId, emailAddress}) =>
      {
        const app = await Resolvers.getAppById(appId);
        const challenge = await Challenge.requestChallenge("email", emailAddress, app.appId, 8, app.challengeLifetime);
        if (!challenge.success)
        {
          return <LoginResponse>{
            success: false,
            errorMessage: challenge.errorMessage
          }
        }

        if (!app.loginMailSubjectTemplate || !app.loginMailTxtTemplate || !app.loginMailHtmlTemplate) {
          throw new Error(`Application ${app.appId} has no or missing e-mail templates!`);
        }

        const mailTemplate:Template = {
          subject: app.loginMailSubjectTemplate,
          bodyPlain: app.loginMailTxtTemplate,
          bodyHtml: app.loginMailHtmlTemplate,
        };

        await Mailer.send(mailTemplate, {
          challenge: challenge.challenge,
          app: {
            ...app,
            challengeLifetimeMinutes: (app.challengeLifetime / 60).toFixed(0),
            tokenLifetimeMinutes: (app.tokenLifetime / 60).toFixed(0)
          },
          env: process.env
        }, emailAddress);

        return <LoginResponse>{
          success: true
        }
      },
      verify: async (parent, {oneTimeToken}) =>
      {
        const verificationResult = await Challenge.verifyChallenge(oneTimeToken);
        if (!verificationResult.success || !verificationResult.type || !verificationResult.key || !verificationResult.appId)
        {
          return <VerifyResponse>{
            success: false,
            errorMessage: "Your code is invalid or already expired.",
            jwt: ""
          }
        }

        const app = await Resolvers.getAppById(verificationResult.appId);
        const jwt = await Resolvers._generateJwt(verificationResult.type, verificationResult.key, verificationResult.appId);

        return <VerifyResponse>{
          success: true,
          jwt: jwt,
          exchangeTokenUrl: app.exchangeTokenUrl
        }
      }
    };

    this.queryResolvers = {
      keys: async (parent, {kid}) =>
      {
        if (!kid)
          throw new Error("No key id (kid) was supplied.")

        const keyId = parseInt(kid);
        const pk = await SigningKeyPair.findPublicKeyById(keyId);
        if (!pk)
          throw new Error("Couldn't find a key with the specified id.");

        return {
          id: pk.id,
          publicKey: pk.publicKeyPem,
          validTo: pk.validTo.toJSON()
        };
      },
      version: async () =>
      {
        const version = packageJson.version.split(".");
        return <Version>{
          major: version[0],
          minor: version[1],
          revision: version[2]
        }
      }
    }
  }

  private static async _generateJwt(type:string, key: string, forAppId: string)
  {
    if (!process.env.KEY_ROTATION_INTERVAL)
    {
      throw new Error("The KEY_ROTATION_INTERVAL environment variable must contain a numeric " +
        "value that specifies the token expiration duration in minutes.")
    }

    const app = await Resolvers.getAppById(forAppId);

    // RFC 7519: 4.1.1.  "iss" (Issuer) Claim
    const iss = process.env.ISSUER;

    // RFC 7519: 4.1.2.  "sub" (Subject) Claim
    const sub = key;
    const subType = type;

    // RFC 7519: 4.1.3.  "aud" (Audience) Claim
    const aud = [app.appId];

    // RFC 7519: 4.1.4.  "exp" (Expiration Time) Claim
    // TODO: Sync with key rotation
    const exp = Math.floor(Date.now() / 1000) + app.tokenLifetime;

    // RFC 7519: 4.1.5.  "nbf" (Not Before) Claim
    // TODO: Sync with key rotation
    // const nbf =

    // RFC 7519: 4.1.6.  "iat" (Issued At) Claim
    const iat = Date.now() / 1000

    // RFC 7519: 4.1.7.  "jti" (JWT ID) Claim
    const jti = ValueGenerator.generateRandomUrlSafeString(16);

    const keypair = await SigningKeyPair.findValidKey();
    if (!keypair)
      throw new Error("No valid key available to sign the jwt.")

    // Construct a key id from this service's external url and a parameterized call to the 'keys' resolver.
    // When this url is called it must return the public key that was used to sign the jwt.
    const kid = process.env.EXTERNAL_URL + "/graphql?query=query%20%7B%20keys%28kid%3A%22" + keypair.id + "%22%29%20%7Bid%2C%20validTo%2C%20publicKey%20%7D%7D";

    const tokenData = {
      iss, sub, subType, aud, exp, iat, jti, kid
    };

    return jsonwebtoken.sign(tokenData, keypair.privateKeyPem, {
      algorithm: "RS256"
    });
  }
}
