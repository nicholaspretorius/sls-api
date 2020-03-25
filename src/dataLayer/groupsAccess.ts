import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { Group } from "./../models/Group";

const XAWS = AWSXRay.captureAWS(AWS);

export class GroupAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(), // new AWS.DynamoDB.DocumentClient(),
        private readonly groupsTable = process.env.GROUPS_TABLE
    ) { }

    async getAllGroups(): Promise<Group[]> {
        console.log("IS_OFFLINE? ", process.env.IS_OFFLINE);

        const result = await this.docClient.scan({
            TableName: this.groupsTable
        }).promise()

        const items = result.Items;

        console.log("ITEMS: ", items);
        return items as Group[];
    }

    async createGroup(group: Group): Promise<Group> {
        console.log("Creating a group with groupId: ", group.id);

        await this.docClient.put({
            TableName: this.groupsTable,
            Item: group
        }).promise();

        return group;
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log("Creating LOCAL DynamoDB Client...");

        return new XAWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        });
    }

    return new XAWS.DynamoDB.DocumentClient();
}