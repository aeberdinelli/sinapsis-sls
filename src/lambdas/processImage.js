const AWS = require('aws-sdk');
const Sharp = require('sharp');

const allowedTypes = ['image/jpg','image/jpeg','image/png'];

async function processImage(event) {
    const s3 = new AWS.S3();
    const [ record ] = event.Records;
    const sizes = [
        { width: 150, height: 150 }, 
        { width: 100, height: 100 }, 
        { width: 50, height: 50 }
    ];

    const { Body, ContentType } = await s3.getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
    }).promise();

    if (!allowedTypes.includes(ContentType)) {
        return {
            statusCode: 400,
            body: 'Format not supported'
        };
    }

    // Generate new images with the max size
    const resized = await Promise.all(
        sizes.map(size => Sharp.resize(size.width, size.height, { fit: 'contain' }).toBuffer())
    );

    // Upload to thumbnails bucket
    await Promise.all(
        sizes.map(
            (size, index) => s3.putObject({
                Bucket: process.env.THUMBNAILS_BUCKET,
                Key: `${size.width}x${size.height}_${record.s3.object.key}`,
                Body: resized[index]
            }).promise()
        )
    );

    return {
        statusCode: 200,
        body: 'Thumbnails have been generated'
    };
}

module.exports = { processImage };