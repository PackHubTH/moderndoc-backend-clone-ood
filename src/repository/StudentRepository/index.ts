import Prisma from '@prisma'
import type { Student } from '@prisma/client'

import { AddStudentParams } from './types'

export const addStudent = async (
  student: AddStudentParams
): Promise<Student> => {
  const { userId, studentNumber, courseId } = student
  console.log({
    studentNumber,
    userId,
    courseId,
  })
  const newStudent = await Prisma.student.create({
    data: {
      studentNumber,
      courseId,
      userId,
    },
  })

  return newStudent
}
