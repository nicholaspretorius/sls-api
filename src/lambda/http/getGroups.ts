import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import "source-map-support/register";
import { getAllGroups } from "./../../businessLogic/groups";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event: ", event);

    const groups = await getAllGroups();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ items: groups })
    };
}

// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import "source-map-support/register";
// import * as AWS from "aws-sdk";

// const docClient = new AWS.DynamoDB.DocumentClient();

// const groupsTable = process.env.GROUPS_TABLE;

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     console.log("Processing Event: ", event);

//     const result = await docClient.scan({
//         TableName: groupsTable
//     }).promise();

//     const items = result.Items;

//     return {
//         statusCode: 200,
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ items })
//     };
// }


