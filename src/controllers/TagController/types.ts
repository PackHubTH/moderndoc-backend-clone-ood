import { z } from 'zod'

export const createTagRequestSchema = z.object({
  name: z.string(),
})

export const updateTagRequestSchema = z.object({
  tagId: z.string(),
  name: z.string(),
})

export const deleteTagRequestSchema = z.object({
  tagId: z.string(),
})
