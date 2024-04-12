import { AddUserParams, GetUserByDepartmentId, GetUserByEmail } from './types'

import Prisma from '@prisma'
import type { User } from '@prisma/client'

export const getUserById = async (id: string): Promise<User> => {
  const user = await Prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      student: true,
      teacher: true,
      staff: true,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

export const getUserByEmail = async (
  email: string
): Promise<GetUserByEmail | null> => {
  const user = await Prisma.user.findFirst({
    where: {
      emails: {
        hasSome: [email],
      },
    },
    include: {
      student: true,
      teacher: true,
      staff: true,
    },
  })

  return user
}

export const addUser = async (user: AddUserParams): Promise<User> => {
  const { emails, nameEn, nameTh, phone, profileImg, role } = user

  const phoneArr = []
  phoneArr.push(phone)

  const newUser = await Prisma.user.create({
    data: {
      emails: emails,
      nameEn: nameEn,
      nameTh: nameTh,
      phones: phoneArr,
      profileImg: profileImg,
      role: role,
    },
  })

  return newUser
}

export const updateUser = async (user: User): Promise<User> => {
  const updatedUser = await Prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      nameEn: user.nameEn,
      nameTh: user.nameTh,
      phones: user.phones!,
      emails: user.emails!,
      profileImg: user.profileImg,
      role: user.role,
      defaultEmailIndex: user.defaultEmailIndex,
      defaultPhoneIndex: user.defaultPhoneIndex,
      signatures: user.signatures,
      notificationConfig: user.notificationConfig!,
    },
  })

  return updatedUser
}

export const getUsersByDepartmentId = async (
  departmentId: string
): Promise<GetUserByDepartmentId[]> => {
  const users = await Prisma.user.findMany({
    select: {
      id: true,
      nameTh: true,
      role: true,
    },
    where: {
      OR: [
        {
          teacher: {
            teacherDepartments: {
              some: {
                departmentId,
              },
            },
          },
        },
        {
          staff: {
            staffDepartments: {
              some: {
                departmentId,
              },
            },
          },
        },
      ],
    },
  })

  return users
}
