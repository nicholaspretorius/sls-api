import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import "source-map-support";
import * as AWS from "aws-sdk";
import { verify } from "jsonwebtoken";
import { JwtToken } from "./../../auth/JwtToken";

const secretId = process.env.AUTH0_SECRET_ID;
const secretField = process.env.AUTH0_SECRET_FIELD;

const client = new AWS.SecretsManager();

// cache secret if a lambda instance is re-used
let cachedSecret: string

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    console.log("Processing Event: ", event);

    try {
        const decodedToken = await verifyToken(event.authorizationToken);
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
}

async function verifyToken(authHeader: string): Promise<JwtToken> {
    if (!authHeader) {
        throw new Error("No authorization header");
    }

    if (!authHeader.toLocaleLowerCase().startsWith("bearer")) {
        throw new Error("Invalid authorization header");
    }

    const split = authHeader.split(" ");
    const token = split[1];

    const secretObj: any = await getSecret();
    const secret = secretObj[secretField];

    // auth will happen here
    return verify(token, secret) as JwtToken;
}

async function getSecret() {
    if (cachedSecret) return cachedSecret;

    const data = await client.getSecretValue({
        SecretId: secretId
    }).promise();

    cachedSecret = data.SecretString;

    return JSON.parse(cachedSecret);
}