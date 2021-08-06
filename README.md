# Thumbnail Generator API
## Setup and run offline
The application is packed with a S3 mock in order to work offline.

- Clone this repository
- Install dependencies: `npm install`
- Start app and infrastructure offline: `./node_modules/.bin/serverless offline`

## Deploy to Cloud
The project is configured to use AWS as the cloud provider. You can deploy easily with the following steps:

- Install AWS CLI (https://aws.amazon.com/cli/)
- Setup your credentials file or declare env vars (https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html#envvars-set)
- Install dependencies: `npm install`
- Deploy: `./node_modules/.bin/serverless deploy`

**Note**: Some values are auto generated such as the S3 bucket names. In order to prevent errors, change the service name in the *serverless.yml* file

## Tests
Run test suite with `npm test`.

## CI/CD
This project also contains a github actions file. To use it, just upload the project to your own github repository and configure the following secrets: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with your CI/CD AWS credentials.

## Stack used
- Serverless Framework
- AWS: S3, Lambda, API Gateway
- NodeJS, AWS SDK, Sharp
- Jasmine