import { Prisma, Staff, StaffType, User } from '@prisma/client'

export type AddStaffParams = {
  userId: string
  departmentIds: string[]
  staffNumber: string
  type: StaffType
}

export type UpdateStaffParams = {
  staff: Staff
  user: User
}

export type GetStaffById = Prisma.StaffGetPayload<{
  include: {
    staffDepartments: true
  }
}>
