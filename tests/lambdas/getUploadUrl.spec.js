const AWS = require('aws-sdk-mock');
const { getUploadUrl } = require('../../src/lambdas/getUploadUrl');

describe('Get upload url endpoint', function() {
    it('Should get a signed url from s3', async function() {
        AWS.mock('S3', 'getSignedUrl', '--mockedUrl--');

        const handlerInvokeResult = await getUploadUrl();
        const body = JSON.parse(handlerInvokeResult.body);
        
        // Check API Gateway response
        expect(handlerInvokeResult.statusCode).toBe(200);
        expect(handlerInvokeResult.body).toEqual(jasmine.any(String));

        // Check url is defined within body
        expect(body.url).toBeDefined();
    });
});