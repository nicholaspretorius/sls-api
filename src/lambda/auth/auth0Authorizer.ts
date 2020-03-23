import { CustomAuthorizerHandler, CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import "source-map-support";

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    console.log("Processing Event: ", event);

    try {
        verifyToken(event.authorizationToken);
        console.log("User was authenticated...");

        return {
            principalId: "user",
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

function verifyToken(authHeader: string) {
    if (!authHeader) {
        throw new Error("No authorization header");
    }

    if (!authHeader.toLocaleLowerCase().startsWith("bearer")) {
        throw new Error("Invalid authorization header");
    }

    const split = authHeader.split(" ");
    const token = split[1];

    // auth will happen here
    if (token !== "123") {
        throw new Error("Invalid token");
    }

    // auth passed
    console.log("AUTH Success!");
}