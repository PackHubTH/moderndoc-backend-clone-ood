import z from 'zod'

export const CreateTemplateSchema = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().default(''),
  templateFile: z.string().url(),
  exampleFile: z.string().url().default(''),
})

export type CreateTemplateRequest = z.infer<typeof CreateTemplateSchema>

export const UpdateTemplateSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().default(''),
  templateFile: z.string().url(),
  exampleFile: z.string().url().default(''),
})

export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateSchema>

export const DeleteTemplateSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
})

export type DeleteTemplateRequest = z.infer<typeof DeleteTemplateSchema>

export const GetDepartmentTemplatesSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().default(1),
})

export type GetDepartmentTemplatesRequest = z.infer<
  typeof GetDepartmentTemplatesSchema
>

export const GetTemplateByIdSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
})

export type GetTemplateByIdRequest = z.infer<typeof GetTemplateByIdSchema>
