import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import "source-map-support/register";
import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient();

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log("Processing Event: ", event);
    const groupId = event.pathParameters.groupId

    const validGroupId = await groupExists(groupId);
    console.log("Valid? ", validGroupId);

    if (!validGroupId) {
        return {
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Group does not exist"
            })
        }
    }

    const images = await getImagesPerGroup(groupId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: images
        })
    }
}

async function groupExists(groupId: string) {

    const result = await docClient.get(
        {
            TableName: groupsTable,
            Key: {
                id: groupId
            }
        }
    ).promise();

    console.log("Get Group: ", result);
    return !!result.Item;
}

async function getImagesPerGroup(groupId: string) {

    const result = await docClient.query({
        TableName: imagesTable,
        KeyConditionExpression: "groupId = :groupId",
        ExpressionAttributeValues: {
            ":groupId": groupId
        },
        ScanIndexForward: false
    }).promise();

    return result.Items;
}