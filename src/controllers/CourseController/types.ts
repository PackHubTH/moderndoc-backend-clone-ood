import { z } from 'zod'

export const getCoursesByDepartmentIdRequestSchema = z.object({
  departmentId: z.string(),
})
