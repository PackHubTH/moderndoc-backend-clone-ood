import { Prisma, Student, User } from '@prisma/client'

export type AddStudentParams = {
  userId: string
  courseId: string
  studentNumber: string
}

export type UpdateStudentParams = {
  student: Student
  user: User
}

export type GetStudentById = Prisma.StudentGetPayload<{
  include: {
    advisor: true
    course: true
  }
}>
