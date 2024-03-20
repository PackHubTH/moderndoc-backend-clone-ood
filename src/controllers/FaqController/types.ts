import { SendDocumentChannel } from '@prisma/client'
import z from 'zod'

export const CreateFaqRequestSchema = z.object({
  titleTh: z.string(),
  titleEn: z.string(),
  documentCodeTh: z.string().default(''),
  documentCodeEn: z.string().default(''),
  description: z.string().default(''),
  guideline: z.string().default(''),
  sendChannel: z.nativeEnum(SendDocumentChannel),
  sendChannelInfo: z.string().default(''),
  extraContact: z.any(),
  files: z.string().url().array().default([]),
  isInternal: z.boolean().default(false),
  templateId: z.string().uuid().optional(),
  tagIds: z.string().uuid().array().optional(),
  userId: z.string().uuid(),
})

export type CreateFaqRequest = z.infer<typeof CreateFaqRequestSchema>

export const GetAllFaqsRequestSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().default(1),
})

export const CreateSubFaqRequestSchema = z.object({
  userId: z.string().uuid(),
  faqId: z.string().uuid(),
  title: z.string(),
  description: z.string().default(''),
})

export type CreateSubFaqRequest = z.infer<typeof CreateSubFaqRequestSchema>

export const UpdateFaqRequestSchema = z.object({
  id: z.string().uuid(),
  titleTh: z.string(),
  titleEn: z.string(),
  documentCodeTh: z.string().default(''),
  documentCodeEn: z.string().default(''),
  description: z.string().default(''),
  guideline: z.string().default(''),
  sendChannel: z.nativeEnum(SendDocumentChannel),
  sendChannelInfo: z.string().default(''),
  extraContact: z.any(),
  files: z.string().url().array().default([]),
  isInternal: z.boolean().default(false),
  templateId: z.string().uuid().optional(),
  tagIds: z.string().uuid().array().optional(),
  userId: z.string().uuid(),
})

export type UpdateFaqRequest = z.infer<typeof UpdateFaqRequestSchema>

export const UpdateSubFaqRequestSchema = z.object({
  userId: z.string().uuid(),
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().default(''),
})

export type UpdateSubFaqRequest = z.infer<typeof UpdateSubFaqRequestSchema>

export const DeleteFaqRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
})

export const DeleteSubFaqRequestSchema = z.object({
  subFaqId: z.string().uuid(),
  userId: z.string().uuid(),
})
