# Serverless API

This is an example Serverless API running on AWS Lamda. 

### Instructions

* Install "serverless" globally. Note that if you are using nvm it will only be installed on the current version: 

`npm i -g serverless`

* Configure Serverless to your AWS IAM user:

`sls config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY --profile serverless-user`

This will add an IAM profile to your `~/aws/credentials` file with your access key and secret key. 

* `npm install`

### Deployment

* `sls deploy -v`

If you get a permissions error when you run deploy you may need to specify the user profile

* `sls deploy -v --aws-profile serverless-user`

Environments: 

* `sls deploy -v --stage ci`
* `sls deploy -v --stage staging`
* `sls deploy -v --stage prod`

### AWS

Default region is "us-east-1".

URL: https://904lavdpr6.execute-api.us-east-1.amazonaws.com/dev/groups

### Web Sockets

Use wscat (WebSocket Cat) to connect to WebSocket: 

* `npm i wscat -g`

Connect: 

* `wscat -c wss://xyz12345.execute-api.us-east-1.amazonaws.com/dev` (Ctrl + C to disconnect)

#### Image Upload

The technical process for uploading an images is as follows: 

1. Post the details of the images: 
    * ```curl --location --request POST 'https://904lavdpr6.execute-api.us-east-1.amazonaws.com/dev/groups/1/images' \
--header 'Content-Type: application/json' \
--data-raw '{
	"title": "Another image"
}'```
2. Make a PUT request to the resulting URL with a binary file (image), on success you will get a 200 response. 
3. Visit the URL returned from the initial POST response to view the image. 


### Local/Offline Execution

* `npm i` - check package.json for dependencies first

* Install DynamoDB Local:

`sls dynamodb install`

* Start the local DynamoDB server: 
    
`sls dynamodb start` 

* Run Serverless Offline: 

`sls offline`

