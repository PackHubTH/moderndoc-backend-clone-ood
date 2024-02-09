import { Department } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as DepartmentRepository from 'repository/DepartmentRepository'

import { getDepartmentsByFacultyIdRequestSchema } from './types'

export const getAllAgencyDepartments = async (req: Request, res: Response) => {
  try {
    const { facultyId } =
      await getDepartmentsByFacultyIdRequestSchema.parseAsync(req.query)

    let departments: Department[] = []
    if (!facultyId)
      departments = await DepartmentRepository.getAllAgencyDepartments()
    else
      departments =
        await DepartmentRepository.getDepartmentsByFacultyId(facultyId)

    const response: ApiResponse<Department[]> = {
      data: departments,
      message: 'Successfully retrieved departments',
      error: null,
    }
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve departments',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
