import Prisma from '@prisma'
import type { Staff } from '@prisma/client'

import { AddStaffParams } from './types'

export const addStaff = async (staff: AddStaffParams): Promise<Staff> => {
  const newStaff = await Prisma.staff.create({
    data: {
      staffNumber: staff.staffNumber,
      userId: staff.userId,
      type: staff.type,
    },
  })

  await addStaffDepartment(newStaff.id, staff.departmentIds)

  return newStaff
}

export const addStaffDepartment = async (
  staffId: string,
  departmentIds: string[]
): Promise<void> => {
  await Prisma.staffDepartment.createMany({
    data: departmentIds.map((departmentId) => ({
      departmentId,
      staffId,
    })),
  })
}
