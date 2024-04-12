import { Prisma, Template, TemplateOperator } from '@prisma/client'

export type CreateTemplateParams = Omit<
  Template,
  'id' | 'lastUpdatedAt' | 'updatedBy' | 'createdBy' | 'createdCount'
> & {
  userId: string
  element: Prisma.InputJsonValue
  operatorId: string[]
}

export type UpdateTemplateParams = Omit<
  Template,
  'lastUpdatedAt' | 'updatedBy' | 'createdBy' | 'createdCount'
> & {
  userId: string
  element: Prisma.InputJsonValue
  operatorId: string[]
}
