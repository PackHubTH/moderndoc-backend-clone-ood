import { Course, Department, Faculty, Level } from '@prisma/client'
import { z } from 'zod'

export const getCoursesByDepartmentIdRequestSchema = z.object({
  departmentId: z.string(),
  level: z.nativeEnum(Level).optional(),
})

export const getCourseByIdRequestSchema = z.object({
  id: z.string().uuid(),
})

export type GetCourseByIdResponse = Course & {
  department: Department | null
  faculty: Faculty | null
}
