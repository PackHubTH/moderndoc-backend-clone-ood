import Prisma from '@prisma'
import type { Student } from '@prisma/client'

import { AddStudentParams } from './types'

export const addStudent = async (
  student: AddStudentParams
): Promise<Student> => {
  const newStudent = await Prisma.student.create({
    data: student,
  })

  return newStudent
}
