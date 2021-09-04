import AWS from 'aws-sdk';

export const S3 = new AWS.S3({
  signatureVersion: 's3v4',
  region: process.env.SNAPSHOT_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.SNAPSHOT_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SNAPSHOT_AWS_SECRET_ACCESS_KEY,
  },
});
