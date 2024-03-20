import { Prisma, User } from '@prisma/client'

export type GetUserById = User & {
  student?: Prisma.StudentGetPayload<{
    include: {
      advisor: true
      course: true
    }
  }>
  teacher?: Prisma.TeacherGetPayload<{
    include: {
      teacherDepartments: true
    }
  }>
  staff?: Prisma.StaffGetPayload<{
    include: {
      staffDepartments: true
    }
  }>
}
