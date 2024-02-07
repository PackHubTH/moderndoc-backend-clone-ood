import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import { getUserByEmail } from 'repository/UserRepository'
import { addStaff } from 'services/StaffService'
import { addStudent } from 'services/StudentService'
import { addTeacher } from 'services/TeacherService'
import { getUserById as getUserByIdService } from 'services/UserService'
import { generateToken } from 'utils/authUtils'

import {
  loginSchema,
  registerStaffSchema,
  registerStudentSchema,
} from './types'

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const user = await getUserByIdService(userId)

    const response: ApiResponse<typeof user> = {
      data: user,
      message: 'Successfully retrieved user',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const requestData = await registerStudentSchema.parseAsync(req.body)

    await addStudent(requestData)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully registered',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const requestData = await registerStaffSchema.parseAsync(req.body)

    await addTeacher(requestData)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully registered',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const registerStaff = async (req: Request, res: Response) => {
  try {
    const requestData = await registerStaffSchema.parseAsync(req.body)

    await addStaff(requestData)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully registered',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = await loginSchema.parseAsync(req.body)

    const user = await getUserByEmail(email)

    if (user === null) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'User not found',
        error: null,
      }
      return res.status(StatusCodes.OK).json(response)
    }

    const token = generateToken(user)

    const response = {
      data: { ...user, token: token },
      message: 'Successfully logged in',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
