import Prisma from '@prisma'
import type { User } from '@prisma/client'

import { addUserParams } from './types'

export const getUserById = async (id: string): Promise<User> => {
  const user = await Prisma.user.findFirst({
    where: {
      id,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

export const addUser = async (user: addUserParams): Promise<User> => {
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
