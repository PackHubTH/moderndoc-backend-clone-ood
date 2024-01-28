import { StaffType } from '@prisma/client'

export type addStaffParams = {
  userId: bigint
  departmentIds: bigint[]
  staffNumber: string
  type: StaffType
}
