import Prisma from '@prisma'
import type { Staff } from '@prisma/client'

import { AddStaffParams, GetStaffById } from './types'

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
  for (const departmentId of departmentIds) {
    await Prisma.staffDepartment.create({
      data: {
        staff: {
          connect: {
            id: staffId,
          },
        },
        department: {
          connect: {
            id: departmentId,
          },
        },
      },
    })
  }
}

export const deleteAllStaffDepartment = async (
  staffId: string
): Promise<void> => {
  await Prisma.staffDepartment.deleteMany({
    where: {
      staffId,
    },
  })
}

export const updateStaff = async (staff: Staff): Promise<Staff> => {
  const updatedStaff = await Prisma.staff.update({
    where: {
      id: staff.id,
    },
    data: {
      staffNumber: staff.staffNumber,
    },
  })

  return updatedStaff
}

export const getStaffByUserId = async (
  userId: string
): Promise<GetStaffById | null> => {
  const staff = await Prisma.staff.findUnique({
    where: {
      userId,
    },
    include: {
      staffDepartments: true,
    },
  })

  return staff
}
