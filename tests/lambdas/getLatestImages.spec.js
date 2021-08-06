const AWS = require('aws-sdk-mock');
const { getLatestImages } = require('../../src/lambdas/getLatestImages');

describe('Get latest images endpoint', function() {
    it('Should list s3 objects and add url to them', async function() {
        AWS.mock('S3', 'listObjectsV2', async () => ({
            Contents: [
                { Key: '--mockKey--' }
            ]
        }));

        const handlerInvokeResult = await getLatestImages();
        const body = JSON.parse(handlerInvokeResult.body);
        
        // Check API Gateway response
        expect(handlerInvokeResult.statusCode).toBe(200);
        expect(handlerInvokeResult.body).toEqual(jasmine.any(String));

        // Check images array is defined
        expect(body.images).toEqual(jasmine.any(Array));
        expect(body.images.length).toBe(1);
        expect(body.images[0].url).toBeDefined();

        // Check API generated the url correctly
        expect(body.images[0].url.endsWith('--mockKey--')).toBe(true);
    });
});