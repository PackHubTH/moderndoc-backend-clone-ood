import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as FileService from 'services/FileService'
import { UploadFileResponse } from 'services/FileService/types'

import { UploadFileRequestSchema } from './types'

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { file, folder, isPublic } = await UploadFileRequestSchema.parseAsync(
      {
        file: req.file,
        ...req.body,
      }
    )

    const data = await FileService.uploadFile(
      file.buffer,
      file.originalname,
      folder,
      isPublic
    )

    const response: ApiResponse<UploadFileResponse> = {
      data,
      message: 'File uploaded successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    res.status(500).json({ message: error })
  }
}
