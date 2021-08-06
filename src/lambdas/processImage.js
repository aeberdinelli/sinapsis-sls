const Resizers = require('../utils/resizer');
const S3 = require('../utils/s3');

const allowedTypes = ['image/jpg','image/jpeg','image/png'];

async function processImage(event) {
    const s3 = S3();
    const [ record ] = event.Records;
    
    // Original image data
    let Body, ContentType;

    // Target thumbnails sizes
    const sizes = [
        { width: 400, height: 300 }, 
        { width: 160, height: 120 }, 
        { width: 120, height: 120 }
    ];

    try {
        const Object = await s3.getObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key
        }).promise();
    
        Body = Object.Body;
        ContentType = Object.ContentType;
    }
    catch (err) {
        console.log(err);

        return { statusCode: 500, body: 'Could not get object' };
    }

    if (!allowedTypes.includes(ContentType)) {
        return {
            statusCode: 400,
            body: 'Format not supported'
        };
    }

    // Generate new images with the max size
    const resized = await Promise.all(
        sizes.map(size => Resizers.Sharp(Body).resize(size.width, size.height, { fit: 'fill' }).toBuffer())
    );

    try {
        // Upload to thumbnails bucket
        await Promise.all(
            sizes.map(
                (size, index) => s3.putObject({
                    Bucket: process.env.THUMBNAILS_BUCKET || 'thumbnails-bucket',
                    ACL: 'public-read',
                    Key: `${size.width}x${size.height}_${record.s3.object.key}`,
                    Body: resized[index]
                }).promise()
            )
        );
    }
    catch (err) {
        console.log(err);

        return { statusCode: 500, body: 'Could not generate thumbnails for image' };
    }

    return {
        statusCode: 200,
        body: 'Thumbnails have been generated'
    };
}

module.exports = { processImage };