import { z } from 'zod'

export const getDepartmentsByFacultyIdRequestSchema = z.object({
  facultyId: z.string().uuid().optional(),
})

export const getDepartmentByIdRequestSchema = z.object({
  id: z.string().uuid(),
})

export const addAgencyDepartmentRequestSchema = z.object({
  name: z.string(),
})

export const updateDepartmentRequestSchema = z.object({
  departmentId: z.string().uuid(),
  name: z.string(),
})
