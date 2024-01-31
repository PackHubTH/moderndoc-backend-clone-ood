import { StaffType } from '@prisma/client'

export type AddStaffParams = {
  userId: string
  departmentIds: string[]
  staffNumber: string
  type: StaffType
}
