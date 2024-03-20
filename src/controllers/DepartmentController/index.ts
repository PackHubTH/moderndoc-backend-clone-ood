import { Department } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as DepartmentRepository from 'repository/DepartmentRepository'

import {
  addAgencyDepartmentRequestSchema,
  getDepartmentByIdRequestSchema,
  getDepartmentsByFacultyIdRequestSchema,
  updateDepartmentRequestSchema,
} from './types'

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

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = await getDepartmentByIdRequestSchema.parseAsync(req.params)

    const department = await DepartmentRepository.getDepartmentById(id)

    const response: ApiResponse<unknown> = {
      data: department,
      message: 'Successfully retrieved department',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve department',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const addAgencyDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = await addAgencyDepartmentRequestSchema.parseAsync(req.body)

    const department = await DepartmentRepository.addAgencyDepartment(name)

    const response: ApiResponse<unknown> = {
      data: department,
      message: 'Successfully added department',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to add department',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentId, name } =
      await updateDepartmentRequestSchema.parseAsync(req.body)

    const department = await DepartmentRepository.updateDepartment(
      departmentId,
      name
    )

    const response: ApiResponse<unknown> = {
      data: department,
      message: 'Successfully updated department',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to update department',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
