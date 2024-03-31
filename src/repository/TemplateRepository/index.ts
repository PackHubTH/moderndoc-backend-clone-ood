import { CreateTemplateParams, UpdateTemplateParams } from './types'

import prisma from '@prisma'

export const createTemplate = async (params: CreateTemplateParams) => {
  const template = await prisma.template.create({
    data: {
      title: params.title,
      description: params.description,
      templateFile: params.templateFile,
      exampleFile: params.exampleFile,
      createdBy: params.userId,
      updatedBy: params.userId,
      departmentId: params.departmentId,
      element: params.element,
    },
  })

  // TODO: catch this error
  for (const operatorId of params.operatorId) {
    await prisma.templateOperator.create({
      data: {
        templateId: template.id,
        operatorId,
      },
    })
  }

  return template
}

export const getTemplateById = async (id: string) => {
  const template = await prisma.template.findUnique({
    where: {
      id,
    },
  })

  return template
}

export const getDepartmentTemplates = async (
  departmentId: string,
  page: number = 1
) => {
  const totalTemplatesCount = await prisma.template.count({
    where: {
      departmentId,
    },
  })
  const totalPages = Math.ceil(totalTemplatesCount / 10)
  const templates = await prisma.template.findMany({
    where: {
      departmentId,
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  return {
    data: templates,
    totalPages: totalPages,
    count: totalTemplatesCount,
  }
}

export const updateTemplateById = async (params: UpdateTemplateParams) => {
  const template = await prisma.template.update({
    where: {
      id: params.id,
    },
    data: {
      title: params.title,
      description: params.description,
      templateFile: params.templateFile,
      exampleFile: params.exampleFile,
      updatedBy: params.userId,
      element: params.element,
    },
  })
  // delete all operators
  const deletedOperators = await prisma.templateOperator.deleteMany({
    where: {
      templateId: params.id,
    },
  })
  // add new operators
  const addedOperators = await Promise.all(
    params.operatorId.map((operatorId) =>
      prisma.templateOperator.create({
        data: {
          templateId: params.id,
          operatorId,
        },
      })
    )
  )

  // TODO: remove debug
  return [template, deletedOperators, addedOperators]
}

export const deleteTemplateById = async (id: string) => {
  const template = await prisma.template.delete({
    where: {
      id,
    },
  })
  const templateOperators = await prisma.templateOperator.deleteMany({
    where: {
      templateId: id,
    },
  })

  return [template, templateOperators]
}
