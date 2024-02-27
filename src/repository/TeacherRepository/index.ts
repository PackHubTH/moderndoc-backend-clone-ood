import Prisma from '@prisma'
import { Role, type Teacher, User } from '@prisma/client'

import { AddTeacherParams, GetTeacherById } from './types'

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

export const deleteAllTeacherDepartment = async (
  teacherId: string
): Promise<void> => {
  await Prisma.teacherDepartment.deleteMany({
    where: {
      teacherId,
    },
  })
}

export const updateTeacher = async (teacher: Teacher) => {
  const updatedTeacher = await Prisma.teacher.update({
    where: {
      id: teacher.id,
    },
    data: {
      staffNumber: teacher.staffNumber,
    },
  })

  return updatedTeacher
}

export const getTeachersByName = async (name: string): Promise<User[]> => {
  const teachers = await Prisma.user.findMany({
    where: {
      OR: [
        {
          nameEn: {
            contains: name,
            mode: 'insensitive',
          },
          role: Role.TEACHER,
        },
        {
          nameTh: {
            contains: name,
            mode: 'insensitive',
          },
          role: Role.TEACHER,
        },
      ],
    },
    include: {
      teacher: true,
    },
    take: 10,
  })

  return teachers
}

export const getTeacherByUserId = async (
  userId: string
): Promise<GetTeacherById | null> => {
  const teacher = await Prisma.teacher.findUnique({
    where: {
      userId,
    },
    include: {
      teacherDepartments: true,
    },
  })

  return teacher
}
