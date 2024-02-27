import Prisma from '@prisma'
import type { Student } from '@prisma/client'

import { AddStudentParams, GetStudentById } from './types'

export const addStudent = async (
  student: AddStudentParams
): Promise<Student> => {
  const { userId, studentNumber, courseId } = student

  const newStudent = await Prisma.student.create({
    data: {
      studentNumber,
      userId,
      courseId,
    },
  })

  return newStudent
}

export const updateStudent = async (student: Student): Promise<Student> => {
  const updatedStudent = await Prisma.student.update({
    where: {
      id: student.id,
    },
    data: {
      studentNumber: student.studentNumber,
      courseId: student.courseId,
      isApproved: student.isApproved,
      advisorId: student.advisorId,
    },
  })

  return updatedStudent
}

export const getStudentByUserId = async (
  userId: string
): Promise<GetStudentById | null> => {
  const student = await Prisma.student.findUnique({
    where: {
      userId,
    },
    include: {
      advisor: {
        include: {
          user: { select: { id: true, nameEn: true, nameTh: true } },
        },
      },
      course: true,
    },
  })

  return student
}
