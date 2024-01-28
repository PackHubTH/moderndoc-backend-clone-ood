import type { Role } from '@prisma/client'

export type addUserParams = {
  nameTh: string
  nameEn: string
  role: Role
  email: string[]
  defaultEmailIndex?: number
  profileImg?: string
  phone: string
}
