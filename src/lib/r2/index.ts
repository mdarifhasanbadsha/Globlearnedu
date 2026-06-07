import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
  throw new Error('R2_BUCKET_NAME and R2_PUBLIC_URL are required');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadFile(key: string, body: Uint8Array | Buffer | string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return r2Client.send(command);
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });
  return r2Client.send(command);
}
