import { Faq } from '@prisma/client'

export type CreateFaqParams = Omit<Faq, 'id' | 'lastUpdatedAt'>
