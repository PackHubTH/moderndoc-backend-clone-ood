import Prisma from '@prisma'
import type { Student } from '@prisma/client'

import { addStudentParams } from './types'

export const addStudent = async (
  student: addStudentParams
): Promise<Student> => {
  const newStudent = await Prisma.student.create({
    data: student,
  })

  return newStudent
}
