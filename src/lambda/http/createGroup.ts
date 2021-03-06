import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import "source-map-support/register";

import { CreateGroupRequest } from "./../../requests/CreateGroupRequest";
import { createGroup } from "./../../businessLogic/groups";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event: ", event);


    const newGroup: CreateGroupRequest = JSON.parse(event.body);

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    const newItem = await createGroup(newGroup, jwtToken);

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ newItem })
    };
};

// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import "source-map-support/register";
// import * as AWS from "aws-sdk";
// import * as uuid from "uuid";
// import { getUserId } from "./../../auth/utils";

// const docClient = new AWS.DynamoDB.DocumentClient();

// const groupsTable = process.env.GROUPS_TABLE;

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     console.log("Processing Event: ", event);

//     const itemId = uuid.v4();
//     const authorization = event.headers.Authorization;
//     const split = authorization.split(' ');
//     const jwtToken = split[1];
//     const userId = getUserId(jwtToken);

//     const parsedBody = JSON.parse(event.body);

//     const newItem = {
//         id: itemId,
//         userId,
//         ...parsedBody
//     };

//     await docClient.put({
//         TableName: groupsTable,
//         Item: newItem
//     }).promise();

//     return {
//         statusCode: 201,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ newItem })
//     };
// };