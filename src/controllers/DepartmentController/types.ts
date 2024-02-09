import { z } from 'zod'

export const getDepartmentsByFacultyIdRequestSchema = z.object({
  facultyId: z.string().uuid().optional(),
})
