const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');

async function getUploadUrl() {
    const s3 = new AWS.S3();

    // Generate url
    const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: process.env.UPLOADS_BUCKET || 'sinapsispoc-api-poc-s3',
        Key: uuid()
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ url: signedUrl })
    }
}

module.exports = { getUploadUrl };