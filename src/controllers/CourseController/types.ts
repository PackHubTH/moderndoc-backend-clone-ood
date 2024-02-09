import { Level } from '@prisma/client'
import { z } from 'zod'

export const getCoursesByDepartmentIdRequestSchema = z.object({
  departmentId: z.string(),
  level: z.nativeEnum(Level).optional(),
})
