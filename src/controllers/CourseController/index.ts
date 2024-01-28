import { Course } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as CourseRepository from 'repository/CourseRepository'

import { getCoursesByDepartmentIdRequestSchema } from './types'

export const getCoursesByDepartmentId = async (req: Request, res: Response) => {
  try {
    const { departmentId } =
      await getCoursesByDepartmentIdRequestSchema.parseAsync(req.params)
    const courses = await CourseRepository.getCoursesByDepartmentId(
      BigInt(departmentId)
    )

    const response: ApiResponse<Course[]> = {
      data: courses,
      message: 'Successfully retrieved courses',
      error: null,
    }
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve courses',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
