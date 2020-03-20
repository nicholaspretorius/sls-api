import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support";
import * as elasticsearch from "elasticsearch";
import * as httpAwsEs from "http-aws-es";

const esHost = process.env.ES_ENDPOINT;

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
});

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log("Processing Events Batch from DynamoDB: ", JSON.stringify(event));

    for (const record of event.Records) {
        console.log("Processing record: ", record);

        if (record.eventName !== "INSERT") {
            continue
        }

        const newItem = record.dynamodb.NewImage;

        console.log("RECORD: ", newItem);

        //const imageId = newItem.id.S;

        const body = {
            id: newItem.id.S,
            groupId: newItem.groupId.S,
            imageUrl: newItem.imageUrl.S,
            title: newItem.title.S,
            timestamp: newItem.timestamp.S
        };

        await es.index({
            index: "images-index",
            type: "images",
            id: newItem.id.S,
            body
        });

    }
}