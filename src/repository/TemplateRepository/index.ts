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

  // Retrieve current template operators
  const currentOperators = await prisma.templateOperator.findMany({
    where: { templateId: params.id },
    select: { operatorId: true },
  })
  // compare current operators with new operators
  const newOperators = params.operatorId
  const operatorsToDelete = currentOperators
    .filter((operator) => !newOperators.includes(operator.operatorId))
    .map((op) => op.operatorId)
  const operatorsToAdd = newOperators.filter(
    (operator) =>
      !currentOperators.map((op) => op.operatorId).includes(operator)
  )
  // add new operators
  for (const operatorId of operatorsToAdd) {
    await prisma.templateOperator.create({
      data: {
        templateId: params.id,
        operatorId,
      },
    })
  }
  // delete operators
  for (const operatorId of operatorsToDelete) {
    await prisma.templateOperator.delete({
      where: {
        templateId_operatorId: {
          operatorId,
          templateId: params.id,
        },
      },
    })
  }

  // TODO: remove debug
  return [template, currentOperators, operatorsToAdd, operatorsToDelete]
}

export const deleteTemplateById = async (id: string) => {
  const template = await prisma.template.delete({
    where: {
      id,
    },
  })

  return template
}
