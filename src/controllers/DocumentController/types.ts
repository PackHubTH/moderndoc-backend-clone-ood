/* eslint-disable no-unused-vars */
import { DocumentStatus } from '@prisma/client'
import z from 'zod'

export const CreateDocumentRequestSchema = z.object({
  userId: z.string().uuid(),
  templateId: z.string().uuid(),
  element: z.any(),
  documentStatus: z.nativeEnum(DocumentStatus),
})

export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>

export const DocumentSentToOperatorRequestSchema = z.object({
  userId: z.string().uuid(),
  documentId: z.string().uuid(),
  operatorUserId: z.string().uuid(),
  message: z.string().default(''),
  isEditable: z.boolean(),
})

export type DocumentSentToOperatorRequest = z.infer<
  typeof DocumentSentToOperatorRequestSchema
>

export enum DocumentAction {
  SEND_BACK_TO_OWNER = 'SEND_BACK_TO_OWNER',
  SEND_TO_OPERATOR = 'SEND_TO_OPERATOR',
  SEND_TO_REVIEW = 'SEND_TO_REVIEW',
  APPROVE = 'APPROVE',
  COMPLETE = 'COMPLETE',
  REJECT = 'REJECT',
}

export const DocumentActionRequestSchema = z
  .object({
    userId: z.string().uuid(),
    documentId: z.string().uuid(),
    element: z.any(),
    action: z.nativeEnum(DocumentAction),
    message: z.string().default(''),
    receiverId: z.string().uuid(),
  })
  .superRefine((data, ctx) => {
    if (data.action === DocumentAction.SEND_TO_REVIEW && !data.receiverId) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'receiverId is required for SEND_TO_REVIEW action',
      })
    }

    return data
  })

export type DocumentActionRequest = z.infer<typeof DocumentActionRequestSchema>

export type DocumentListType = 'ALL' | 'SENT' | 'RECEIVED'

export const GetDocumentListRequestSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().default(1),
  type: z.custom<DocumentListType>(),
})

export const GetDocumentByIdRequestSchema = z.object({
  userId: z.string().uuid(),
  documentId: z.string().uuid(),
})
