import {ValueGenerator} from "@circlesland/auth-util/dist/valueGenerator";
import {publicEncrypt} from "crypto";
import * as constants from "constants";
import {prisma_ro} from "./prisma_ro";
import {prisma_rw} from "./prisma_rw";
import {Challenges, ChallengeState} from "@prisma/client";

export interface RequestChallengeResponse
{
  success: boolean,
  errorMessage?: string,
  challenge?: string
  validTo?: Date
}

export interface VerifyChallengeResponse
{
  success: boolean,
  type?: string,
  key?: string,
  appId?: string
}

export class Challenge
{
  public static async findPendingChallengesByKey(key:string)
      : Promise<null|{key:string, validUntil:Date|null}>
  {
    const result:{key:string, validUntil:Date|null}[] =
        await prisma_ro.$queryRaw`WITH unsolved AS (
                                      SELECT *
                                      FROM "Challenges"
                                      WHERE "status" = 'Unsolved'
                                      AND "validUntil" > now()
                                  )
                                  SELECT unsolved.key, unsolved."validUntil"
                                  from unsolved
                                  LEFT JOIN "Challenges" solved ON (solved.type = unsolved.type
                                                                        AND solved.key = unsolved.key
                                                                        AND solved.challenge = unsolved.challenge
                                                                        AND solved.status = 'Solved')
                                  WHERE solved.timestamp IS NULL
                                    AND unsolved.key = ${key};`;
    if (result.length == 0)
      return null;
    if (result.length > 1)
      throw new Error(`Assert failed: There must be no more than one valid and unsolved challenge for key '${key}'.`);

    return result[0];
  }

  public static async findPendingChallengesByChallenge(challenge:string)
      : Promise<null|Challenges>
  {
    const result:Challenges[] =
        await prisma_ro.$queryRaw`WITH unsolved AS (
                                      SELECT *
                                      FROM "Challenges"
                                      WHERE "status" = 'Unsolved'
                                      AND "validUntil" > now()
                                  )
                                  SELECT unsolved.*
                                  from unsolved
                                  LEFT JOIN "Challenges" solved ON (solved.type = unsolved.type
                                                                        AND solved.key = unsolved.key
                                                                        AND solved.challenge = unsolved.challenge
                                                                        AND solved.status = 'Solved')
                                  WHERE solved.timestamp IS NULL
                                    AND unsolved.challenge = ${challenge};`;
    if (result.length == 0)
      return null;
    if (result.length > 1)
      throw new Error(`Assert failed: There must be no more than one valid and unsolved entry for challenge '${challenge}'.`);

    return result[0];
  }

  public static async requestChallenge(type: string, key: string, forAppId: string, length: number, validForNSeconds: number): Promise<RequestChallengeResponse>
  {
    const now = new Date();

    const pendingChallenge = await Challenge.findPendingChallengesByKey(key);
    if (pendingChallenge)
    {
      return {
        success: false,
        errorMessage: "There is a pending challenge for this login. " +
          "Please solve it first or let it time-out before requesting a new one.\n" + `Timeout at: ${pendingChallenge.validUntil?.toString() ?? 'no timeout'}`
      }
    }

    // encrypt the challenge with the supplied public key
    let challenge = ValueGenerator.generateRandomUrlSafeString(length);
    if (type === "publicKey")
    {
      const challengeBuffer = Buffer.from(challenge, "utf8");
      const encryptedChallengeBuffer = publicEncrypt({
        key: key,
        padding: constants.RSA_PKCS1_PADDING
      }, challengeBuffer);
      challenge = encryptedChallengeBuffer.toString("base64");
    }
    else if (type === "email")
    {
      // Leave as is
    }
    else
    {
      throw new Error("Unknown challenge type '" + type + "'.");
    }

    const validUntil = new Date(new Date().getTime() + (validForNSeconds * 1000));

    await prisma_rw.challenges.create({
      data: {
        appId: forAppId,
        type: type,
        key: key,
        timestamp: now,
        status: ChallengeState.Unsolved,
        validUntil: validUntil,
        challenge: challenge
      },
      select: {
        challenge: true,
        validUntil: true
      }
    });

    return {
      success: true,
      challenge: challenge,
      validTo: validUntil
    };
  }

  public static async verifyChallenge(challengeResponse: string): Promise<VerifyChallengeResponse>
  {
    const now = new Date();

    const pendingChallenge = await Challenge.findPendingChallengesByChallenge(challengeResponse);
    if (!pendingChallenge)
    {
      return {
        success: false
      }
    }

    // TODO: Don't rely on the unique index to prevent re-solving of an already solved challenge
    await prisma_rw.challenges.create({
      data: {
        ...pendingChallenge,
        timestamp: now,
        validUntil: null,
        status: ChallengeState.Solved
      }
    });

    return {
      success: true,
      type: pendingChallenge.type,
      key: pendingChallenge.key,
      appId: pendingChallenge.appId
    }
  }
}
