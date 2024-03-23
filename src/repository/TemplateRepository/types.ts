import { Template } from '@prisma/client'

export type CreateTemplateParams = Omit<
  Template,
  'id' | 'lastUpdatedAt' | 'updatedBy' | 'createdBy'
> & {
  userId: string
}

export type UpdateTemplateParams = Omit<
  Template,
  'lastUpdatedAt' | 'updatedBy' | 'createdBy'
> & {
  userId: string
}
