import { Prisma, Teacher, User } from '@prisma/client'

export type AddTeacherParams = {
  userId: string
  departmentIds: string[]
  staffNumber: string
}

export type UpdateTeacherParams = {
  user: User
  teacher: Teacher
}

export type GetTeacherById = Prisma.TeacherGetPayload<{
  include: {
    teacherDepartments: true
  }
}>
