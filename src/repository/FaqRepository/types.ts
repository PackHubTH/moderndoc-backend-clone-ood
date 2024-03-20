import { Faq, SubFaq } from '@prisma/client'

export type CreateFaqParams = Omit<
  Faq,
  'id' | 'lastUpdatedAt' | 'updatedBy' | 'createdBy'
> & {
  userId: string
}

export type UpdateFaqParams = Omit<
  Faq,
  'lastUpdatedAt' | 'updatedBy' | 'createdBy' | 'lastUpdatedAt' | 'departmentId'
> & {
  userId: string
}

export type CreateSubFaqParams = Omit<
  SubFaq,
  'id' | 'lastUpdatedAt' | 'updatedBy' | 'createdBy'
> & {
  userId: string
}

export type UpdateSubFaqParams = Omit<
  SubFaq,
  'lastUpdatedAt' | 'updatedBy' | 'createdBy' | 'faqId'
> & {
  userId: string
}
