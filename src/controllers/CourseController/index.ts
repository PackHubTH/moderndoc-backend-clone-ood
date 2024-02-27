import { Course } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as CourseRepository from 'repository/CourseRepository'

import {
  getCourseByIdRequestSchema,
  GetCourseByIdResponse,
  getCoursesByDepartmentIdRequestSchema,
} from './types'

export const getCoursesByDepartmentId = async (req: Request, res: Response) => {
  try {
    const { departmentId, level } =
      await getCoursesByDepartmentIdRequestSchema.parseAsync(req.query)

    const courses = await CourseRepository.getCoursesByDepartmentId(
      departmentId,
      level
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

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = await getCourseByIdRequestSchema.parseAsync(req.params)

    const course = await CourseRepository.getCourseById(id)

    const response: ApiResponse<GetCourseByIdResponse> = {
      data: course as GetCourseByIdResponse,
      message: 'Successfully retrieved course',
      error: null,
    }
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve course',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
