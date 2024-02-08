import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import { getUserByEmail } from 'repository/UserRepository'
import { addStaff } from 'services/StaffService'
import { addStudent } from 'services/StudentService'
import { addTeacher } from 'services/TeacherService'
import { generateToken } from 'utils/authUtils'
import { getIsUserFinishedRegister } from 'utils/userUtils'

import {
  loginSchema,
  RegisterResponse,
  registerStaffSchema,
  registerStudentSchema,
} from './types'

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const requestData = await registerStudentSchema.parseAsync(req.body)

    await addStudent(requestData)

    const user = await getUserByEmail(requestData.emails[0])
    if (user === null) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'There was an error registering the user',
        error: null,
      }
      return res.status(StatusCodes.IM_A_TEAPOT).json(response)
    }

    const token = generateToken(user)

    const response: ApiResponse<RegisterResponse> = {
      data: {
        ...user,
        token: token,
        isFinishRegister: getIsUserFinishedRegister(user),
      },
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

    const user = await getUserByEmail(requestData.emails[0])

    if (user === null) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'There was an error registering the user',
        error: null,
      }
      return res.status(StatusCodes.IM_A_TEAPOT).json(response)
    }

    const token = generateToken(user)

    const response: ApiResponse<RegisterResponse> = {
      data: {
        ...user,
        token: token,
        isFinishRegister: getIsUserFinishedRegister(user),
      },
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

    const user = await getUserByEmail(requestData.emails[0])
    if (user === null) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'There was an error registering the user',
        error: null,
      }
      return res.status(StatusCodes.IM_A_TEAPOT).json(response)
    }

    const token = generateToken(user)

    const response: ApiResponse<RegisterResponse> = {
      data: {
        ...user,
        token: token,
        isFinishRegister: getIsUserFinishedRegister(user),
      },
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

    const response: ApiResponse<RegisterResponse> = {
      data: {
        ...user,
        token: token,
        isFinishRegister: getIsUserFinishedRegister(user),
      },
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
