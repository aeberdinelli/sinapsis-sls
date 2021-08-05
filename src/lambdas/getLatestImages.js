const AWS = require('aws-sdk');
const Bucket = process.env.THUMBNAILS_BUCKET || 'sinapsispoc-api-poc-thumbnails';

async function getLatestImages() {
    const s3 = new AWS.S3();
    const { Contents: images } = await s3.listObjectsV2({ Bucket }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            images: images.map(image => {
                const url = `https://${Bucket}.s3.${process.env.REGION}.amazonaws.com/${image.Key}`;

                return { ...image, url };
            })
        })
    }
}

module.exports = { getLatestImages };