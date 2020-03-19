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

### AWS

Default region is "us-east-1".

URL: https://904lavdpr6.execute-api.us-east-1.amazonaws.com/dev/groups

### Web Sockets

Use wscat (WebSocket Cat) to connect to WebSocket: 

* `npm i wscat -g`

Connect: 

* `wscat -c wss://xyz12345.execute-api.us-east-1.amazonaws.com/dev` (Ctrl + C to disconnect)
