import { Role, User } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import { getUserByEmail } from 'repository/UserRepository'
import { addStaff, updateStaff } from 'services/StaffService'
import { addStudent, updateStudent } from 'services/StudentService'
import { addTeacher, updateTeacher } from 'services/TeacherService'
import { getUserById } from 'services/UserService'
import { generateToken } from 'utils/authUtils'
import { getIsUserFinishedRegister } from 'utils/userUtils'
import z from 'zod'

import * as TeacherRepository from './../../repository/TeacherRepository'
import * as UserRepository from './../../repository/UserRepository'
import * as StaffService from './../../services/StaffService'
import * as TeacherService from './../../services/TeacherService'
import {
  changeDepartmentRequestSchema,
  getUserSchema,
  loginSchema,
  RegisterResponse,
  registerStaffSchema,
  registerStudentSchema,
  updateUserSchema,
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

export const updatedUser = async (req: Request, res: Response) => {
  try {
    const request = await updateUserSchema.parseAsync(req.body)
    switch (request.role) {
      case Role.STUDENT:
        await updateStudent(request)
        break
      case Role.TEACHER:
        await updateTeacher(request)
        break
      case Role.STAFF:
        await updateStaff(request)
        break
    }

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully updated user',
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

export const changeDepartment = async (req: Request, res: Response) => {
  try {
    const { userId, departmentId } =
      await changeDepartmentRequestSchema.parseAsync({
        ...req.headers,
        ...req.body,
      })

    const user = await getUserById(userId)

    switch (user?.role) {
      case Role.TEACHER:
        await TeacherService.changeDepartment(userId, departmentId)
        break
      case Role.STAFF:
        await StaffService.changeDepartment(userId, departmentId)
        break
      default:
        throw new Error('Invalid role')
    }

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully changed department',
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

export const getTeachersByName = async (req: Request, res: Response) => {
  const getTeachersByNameSchema = z.string().min(3)
  try {
    const name = await getTeachersByNameSchema.parseAsync(req.query.name)

    const teachers = await TeacherRepository.getTeachersByName(name)

    const response: ApiResponse<User[]> = {
      data: teachers,
      message: 'Successfully retrieved teachers',
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

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = await getUserSchema.parseAsync(req.headers)

    const user = await getUserById(userId)

    if (user === null) {
      const response: ApiResponse<null> = {
        data: null,
        message: 'User not found',
        error: null,
      }
      return res.status(StatusCodes.OK).json(response)
    }

    const response: ApiResponse<unknown> = {
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

export const getUsersByDepartmentId = async (req: Request, res: Response) => {
  const getUsersByDepartmentIdSchema = z.string()
  try {
    const departmentId = await getUsersByDepartmentIdSchema.parseAsync(
      req.params.id
    )
    console.log('departmentId', departmentId)

    // const teachers =
    //   await TeacherRepository.getTeacherByDepartmentId(departmentId)

    // const staffs = await StaffRepository.getStaffByDepartmentId(departmentId)
    const users = await UserRepository.getUsersByDepartmentId(departmentId)

    // const users = await TeacherRepository.getUsersByDepartmentId(departmentId)

    // const response: ApiResponse<User[]> = {
    //   data: users,
    //   message: 'Successfully retrieved users',
    //   error: null,
    // }
    const response = {
      data: users,
      message: 'Successfully retrieved users',
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
