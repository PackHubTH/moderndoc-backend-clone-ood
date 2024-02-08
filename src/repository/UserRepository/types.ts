import type { Prisma, Role } from '@prisma/client'

export type AddUserParams = {
  nameTh: string
  nameEn: string
  role: Role
  emails: string[]
  defaultEmailIndex?: number
  profileImg?: string
  phone: string
}

export type GetUserByEmail = Prisma.UserGetPayload<{
  include: {
    staff: true
    teacher: true
    student: true
  }
}>
