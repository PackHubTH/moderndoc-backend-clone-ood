import * as DepartmentRepository from './../../repository/DepartmentRepository/index'
import * as StaffRepository from './../../repository/StaffRepository/index'
import * as TeacherRepository from './../../repository/TeacherRepository/index'
import * as UserRepository from './../../repository/UserRepository/index'

import {
  RegisterResponse,
  getUserSchema,
  loginSchema,
  registerStaffSchema,
  registerStudentSchema,
  updateUserSchema,
} from './types'
import { Request, Response } from 'express'
import { addStaff, updateStaff } from 'services/StaffService'
import { addStudent, updateStudent } from 'services/StudentService'
import { addTeacher, updateTeacher } from 'services/TeacherService'

import { ApiResponse } from 'models/response'
import { StatusCodes } from 'http-status-codes'
import { User } from '@prisma/client'
import { generateToken } from 'utils/authUtils'
import { getIsUserFinishedRegister } from 'utils/userUtils'
import { getUserByEmail } from 'repository/UserRepository'
import { getUserById } from 'services/UserService'
import z from 'zod'

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
      case 'STUDENT':
        await updateStudent(request)
        break
      case 'TEACHER':
        await updateTeacher(request)
        break
      case 'STAFF':
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
  const getUsersByDepartmentIdSchema = z.string().uuid()
  try {
    const departmentId = await getUsersByDepartmentIdSchema.parseAsync(
      req.params.id
    )
    console.log('departmentId', departmentId)

    const users = await UserRepository.getUsersByDepartmentId(departmentId)

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

export const getUsersByAllAgency = async (req: Request, res: Response) => {
  try {
    const departments = await DepartmentRepository.getAllAgencyDepartments()

    const usersByDepartment = await Promise.all(
      departments.map((department) =>
        UserRepository.getUsersByDepartmentId(department.id)
      )
    )
    const users = departments.map((department, index) => ({
      departmentId: department.id,
      users: usersByDepartment[index],
    }))

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
