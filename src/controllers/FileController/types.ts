import { S3FolderEnum } from 'services/FileService/types'
import z from 'zod'

export const UploadFileRequestSchema = z.object({
  file: z.object({
    buffer: z.any(),
    originalname: z.string(),
  }),
  folder: z.nativeEnum(S3FolderEnum),
  isPublic: z.boolean().default(false),
})
