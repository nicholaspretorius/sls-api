import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import "source-map-support";
import { verify } from "jsonwebtoken";
import { JwtToken } from "./../../auth/JwtToken";

import * as middy from "middy";
import { secretsManager } from "middy/middlewares";

const secretId = process.env.AUTH0_SECRET_ID;
const secretField = process.env.AUTH0_SECRET_FIELD;

// const client = new AWS.SecretsManager();

// // cache secret if a lambda instance is re-used
// let cachedSecret: string

export const handler = middy(async (event: CustomAuthorizerEvent, context): Promise<CustomAuthorizerResult> => {
    console.log("Processing Event: ", event);

    try {
        const decodedToken = verifyToken(event.authorizationToken, context.AUTH0_SECRET[secretField]);
        console.log("User was authenticated...");

        return {
            principalId: decodedToken.sub,
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "*"
                    }
                ]
            }
        }
    } catch (error) {
        console.log("Auth0 Error: ", error);

        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Deny",
                        Resource: "*"
                    }
                ]
            }
        }
    }
});

function verifyToken(authHeader: string, secret: string): JwtToken {
    if (!authHeader) {
        throw new Error("No authorization header");
    }

    if (!authHeader.toLocaleLowerCase().startsWith("bearer")) {
        throw new Error("Invalid authorization header");
    }

    const split = authHeader.split(" ");
    const token = split[1];

    // const secretObj: any = await getSecret();
    // const secret = secretObj[secretField];

    // auth will happen here
    return verify(token, secret) as JwtToken;
}

handler.use(
    secretsManager({
        cache: true,
        cacheExpiryInMillis: 60000,
        throwOnFailedCall: true,
        secrets: {
            AUTH0_SECRET: secretId
        }
    })
);

// replace by using middy secretsManager
// async function getSecret() {
//     if (cachedSecret) return cachedSecret;

//     const data = await client.getSecretValue({
//         SecretId: secretId
//     }).promise();

//     cachedSecret = data.SecretString;

//     return JSON.parse(cachedSecret);
// }