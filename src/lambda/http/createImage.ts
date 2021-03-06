import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from "uuid";

import * as middy from "middy";
import { cors } from "middy/middlewares";

// import * as AWSXRay from "aws-xray-sdk";
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS);


const docClient = new XAWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3({
    signatureVersion: 'v4'
});

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Caller event", event)
    const groupId = event.pathParameters.groupId
    const validGroupId = await groupExists(groupId)

    if (!validGroupId) {
        return {
            statusCode: 404,
            // headers: {
            //     "Access-Control-Allow-Origin": "*"
            // },
            body: JSON.stringify({
                error: "Group does not exist"
            })
        }
    }

    // TODO: Create an image
    const imageId = uuid.v4();

    const parsedBody = JSON.parse(event.body);

    const newImage = {
        id: imageId,
        groupId: groupId,
        timestamp: new Date().toISOString(),
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
        ...parsedBody
    };

    const url = await getUploadUrl(imageId);

    await docClient.put({
        TableName: imagesTable,
        Item: newImage
    }).promise();

    return {
        statusCode: 201,
        headers: {
            // "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Credentials",
        },
        body: JSON.stringify({
            image: newImage,
            uploadUrl: url
        })
    }
});

async function groupExists(groupId: string) {
    const result = await docClient
        .get({
            TableName: groupsTable,
            Key: {
                id: groupId
            }
        })
        .promise()

    console.log("Get group: ", result)
    return !!result.Item
}

function getUploadUrl(imageId: string) {
    return s3.getSignedUrl("putObject", {
        Bucket: bucketName,
        Key: imageId,
        Expires: parseInt(urlExpiration)
    });
}

handler.use(
    cors({
        credentials: true,
        origin: "*"
    })
);