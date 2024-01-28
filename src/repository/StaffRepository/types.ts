import { StaffType } from '@prisma/client'

export type AddStaffParams = {
  userId: bigint
  departmentIds: bigint[]
  staffNumber: string
  type: StaffType
}
