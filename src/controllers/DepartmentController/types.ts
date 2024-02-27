import { getDepartmentById } from 'repository/DepartmentRepository'
import { z } from 'zod'

export const getDepartmentsByFacultyIdRequestSchema = z.object({
  facultyId: z.string().uuid().optional(),
})

export const getDepartmentByIdRequestSchema = z.object({
  id: z.string().uuid(),
})
