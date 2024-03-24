import { GetObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'
import { addTimeToFileName, getS3Client } from 'utils/fileUtils'

import { Upload } from '@aws-sdk/lib-storage'
import { UploadFileResponse } from './types'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

  const client = getS3Client()

  try {
    const parallelUpload = new Upload({
      client,
      params,
    })

    const data = await parallelUpload.done()
    console.log('File uploaded to S3')

    const actualFileName = data.Key!.split('/').pop() as string
    const actualUrl = data.Location!
    const result = await getFileUrl(actualFileName, folder)

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
  const client = getS3Client()

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return url
}
