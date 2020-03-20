import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support";

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log("Processing Events Batch from DynamoDB: ", JSON.stringify(event));

    for (const record of event.Records) {
        console.log("Processing record: ", record);
    }
}