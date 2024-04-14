import { Prisma, Role, Staff, Student, Teacher, User } from '@prisma/client'
import { GetUserByEmail } from 'repository/UserRepository/types'
import { z } from 'zod'

export const registerStudentSchema = z.object({
  nameTh: z.string().min(5).max(255),
  nameEn: z.string().min(5).max(255),
  studentNumber: z.string().min(11).max(11),
  profileImg: z
    .string()
    .url()
    .default('https://www.w3schools.com/howto/img_avatar.png'),
  emails: z.array(z.string().email()).min(1),
  defaultEmailIndex: z.number().default(0),
  phone: z.string().min(9).max(10),
  courseId: z.string().uuid(),
})

export type RegisterStudentParams = z.infer<typeof registerStudentSchema>

export const registerStaffSchema = z.object({
  role: z.nativeEnum(Role),
  nameTh: z.string().min(5).max(255),
  nameEn: z.string().min(5).max(255),
  staffNumber: z.string(),
  profileImg: z
    .string()
    .url()
    .default('https://www.w3schools.com/howto/img_avatar.png'),
  emails: z.array(z.string().email()).min(1),
  defaultEmailIndex: z.number().default(0),
  phone: z.string().min(9).max(10),
  departmentIds: z.array(z.string().uuid()).min(1),
})

export type RegisterStaffSchema = z.infer<typeof registerStaffSchema>

export const loginSchema = z.object({
  email: z.string().email(),
})

export type RegisterResponse = GetUserByEmail & {
  token: string
  isFinishRegister: boolean
}

export type updateUser = {
  role: Role
  student?: Student
  staff?: Staff
  teacher?: Teacher
  User: User
}
export const updateUserSchema = z
  .object({
    role: z.nativeEnum(Role),
    user: z.custom<User>(),
    student: z.custom<Student>().optional(),
    staff: z
      .custom<
        Prisma.StaffGetPayload<{
          include: { staffDepartments: true }
        }>
      >()
      .optional(),
    teacher: z
      .custom<
        Prisma.TeacherGetPayload<{
          include: { teacherDepartments: true }
        }>
      >()
      .optional(),
  })
  .refine((data) => {
    if (data.role === 'STUDENT' && !data.student) {
      throw new Error('Student data is required')
    }
    if (data.role === 'TEACHER' && !data.teacher) {
      throw new Error('Teacher data is required')
    }
    if (data.role === 'STAFF' && !data.staff) {
      throw new Error('Staff data is required')
    }
    return true
  })

export type UpdateUserParams = z.infer<typeof updateUserSchema>

export const getUserSchema = z.object({
  userId: z.string().uuid(),
})

export const changeDepartmentRequestSchema = z.object({
  userId: z.string().uuid(),
  departmentId: z.string().uuid(),
})
