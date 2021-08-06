const { uuid } = require('uuidv4');
const S3 = require('../utils/s3');

// GET /getUploadUrl
async function getUploadUrl() {
    const s3 = S3();

    try {
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
    catch(err) {
        console.log(err);

        return {
            statusCode: 500,
            body: 'Could not generate signed URL'
        };
    }
}

module.exports = { getUploadUrl };