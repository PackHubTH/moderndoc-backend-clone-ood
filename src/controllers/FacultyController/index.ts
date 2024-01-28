import { Faculty } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as FacultyRepository from 'repository/FacultyRepository'

export const getAllFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await FacultyRepository.getAllFaculties()

    const response: ApiResponse<Faculty[]> = {
      data: faculties,
      message: 'Successfully retrieved faculties',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve faculties',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
