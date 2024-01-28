import Prisma from '@prisma'
import type { Teacher } from '@prisma/client'

import { AddTeacherParams } from './types'

export const addTeacher = async (
  teacher: AddTeacherParams
): Promise<Teacher> => {
  const newTeacher = await Prisma.teacher.create({
    data: {
      staffNumber: teacher.staffNumber,
      userId: teacher.userId,
    },
  })

  await addTeacherDepartment(newTeacher.id, teacher.departmentIds)

  return newTeacher
}

export const addTeacherDepartment = async (
  teacherId: bigint,
  departmentIds: bigint[]
): Promise<void> => {
  await Prisma.teacherDepartment.createMany({
    data: departmentIds.map((departmentId) => ({
      departmentId,
      teacherId,
    })),
  })
}
