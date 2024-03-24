import { Prisma, Template } from '@prisma/client'

export type CreateTemplateParams = Omit<
  Template,
  'id' | 'lastUpdatedAt' | 'updatedBy' | 'createdBy' | 'createdCount'
> & {
  userId: string
  element: Prisma.InputJsonValue
}

export type UpdateTemplateParams = Omit<
  Template,
  'lastUpdatedAt' | 'updatedBy' | 'createdBy'
> & {
  userId: string
}
