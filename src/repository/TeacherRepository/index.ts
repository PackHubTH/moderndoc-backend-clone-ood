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
  teacherId: string,
  departmentIds: string[]
): Promise<void> => {
  for (const departmentId of departmentIds) {
    await Prisma.teacherDepartment.create({
      data: {
        teacher: {
          connect: {
            id: teacherId,
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
