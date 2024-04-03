import { DocumentSent, DocumentTimeline } from '@prisma/client'

export type CreateDocumentSentParams = Omit<
  DocumentSent,
  'id' | 'sendAt' | 'messageTimes'
>

export type CreateDocumentTimeline = Omit<DocumentTimeline, 'id' | 'createdAt'>
