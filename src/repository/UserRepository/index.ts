import Prisma from '@prisma'
import type { User } from '@prisma/client'

import { addUserParams } from './types'

export const getUserById = async (id: number): Promise<User> => {
  const user = await Prisma.user.findFirst({
    where: {
      id,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

export const addUser = async (user: addUserParams): Promise<User> => {
  const newUser = await Prisma.user.create({
    data: user,
  })

  return newUser
}
