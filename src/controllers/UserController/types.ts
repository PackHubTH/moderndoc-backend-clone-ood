import { Role } from '@prisma/client'
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
