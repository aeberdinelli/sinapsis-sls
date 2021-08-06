const AWS = require('aws-sdk-mock');
const Resizers = require('../../src/utils/resizer');

const { processImage } = require('../../src/lambdas/processImage');

describe('Process image lambda', function() {
    const eventMock = {
        Records: [
            {
                s3: {
                    bucket: { name: '--mockedBucket--' },
                    object: { key: '--mockedKey--' }
                }
            }
        ]
    };

    beforeEach(() => {
        AWS.restore('S3');
    });

    it('Should fail when processing unsupported file format', async function() {
        AWS.mock('S3', 'getObject', async () => ({
            Body: '--mockedBody--',
            ContentType: 'text/plain'
        }));

        const lambdaInvokeResult = await processImage(eventMock);

        expect(lambdaInvokeResult.statusCode).toBe(400);
        expect(lambdaInvokeResult.body).toBe('Format not supported');
    });

    it('Should generate thumbnails for each target size', async function() {
        AWS.mock('S3', 'getObject', async () => ({
            Body: '--mockedBody--',
            ContentType: 'image/jpg'
        }));

        // Check if putObject is called with resized image
        AWS.mock('S3', 'putObject', async(options) => {
            expect(options.Body).toBe('--resizedBufferMock--');
            expect(options.ACL).toBe('public-read');
            expect(options.Bucket).toBeDefined();
            expect(options.Key.endsWith('--mockedKey--')).toBe(true);
        });

        // Mock Sharp resize
        spyOn(Resizers, 'Sharp').and.returnValue({
            resize() {
                return {
                    async toBuffer() {
                        return '--resizedBufferMock--';
                    }
                }
            }
        });

        const lambdaInvokeResult = await processImage(eventMock);

        expect(lambdaInvokeResult.statusCode).toBe(200);
        expect(lambdaInvokeResult.body).toBe('Thumbnails have been generated');
    });
});