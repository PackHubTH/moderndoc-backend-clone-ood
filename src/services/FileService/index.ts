import {
  GetObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { addTimeToFileName } from 'utils/fileUtils'

import { UploadFileResponse } from './types'

const client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const uploadFile = async (
  fileContent: Buffer,
  fileName: string,
  folder: string,
  isPublic: boolean = false
): Promise<UploadFileResponse | undefined> => {
  const fullFileName = folder + '/' + addTimeToFileName(fileName)

  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fullFileName,
    Body: fileContent,
    ACL: isPublic ? 'public-read' : 'private',
  }

  try {
    const parallelUpload = new Upload({
      client,
      params,
    })

    await parallelUpload.done()

    const actualUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fullFileName}`
    const result = await getFileUrl(fileName, folder)

    return {
      fileUrl: actualUrl,
      accessUrl: result,
    }
  } catch (error) {
    console.error(error)
  }
}

export const getFileUrl = async (fileName: string, folder: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: folder + '/' + fileName,
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return url
}
