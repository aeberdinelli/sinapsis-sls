const AWS = require('aws-sdk');

function S3() {
    if (process.env.IS_OFFLINE === 'true') {
        return new AWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: new AWS.Endpoint('http://localhost:4569'),
        });
    }

    return new AWS.S3();
}

module.exports = { S3 };