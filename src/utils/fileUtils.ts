import { S3Client } from '@aws-sdk/client-s3'

export const addTimeToFileName = (fileName: string) => {
  const date = new Date()
  const time = date.getTime()
  return `${time}-${fileName}`
}

export const getS3Client = () =>
  new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
