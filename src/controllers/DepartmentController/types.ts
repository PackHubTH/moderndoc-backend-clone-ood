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

export const getDepartmentMembersRequestSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().default(1),
  isApproved: z.boolean().default(false),
  search: z.string().optional(),
})

export type GetDepartmentMembersRequest = z.infer<
  typeof getDepartmentMembersRequestSchema
>

export const approveDepartmentMemberRequestSchema = z.object({
  userId: z.string().uuid(),
  memberUserId: z.string().uuid(),
  isApproved: z.boolean(),
})

export type ApproveDepartmentMemberRequest = z.infer<
  typeof approveDepartmentMemberRequestSchema
>
