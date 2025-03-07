import prisma from '@prisma'

import { CreateTemplateParams, UpdateTemplateParams } from './types'

export const createTemplate = async (params: CreateTemplateParams) => {
  const template = await prisma.template.create({
    data: {
      title: params.title,
      description: params.description,
      templateFile: params.templateFile,
      exampleFile: params.exampleFile,
      element: params.element ?? {},
      createdBy: params.userId,
      updatedBy: params.userId,
      departmentId: params.departmentId,
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
  page: number = 1,
  search: string
) => {
  const totalTemplatesCount = await prisma.template.count({
    where: {
      AND: {
        departmentId,
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
    },
  })
  const totalPages = Math.ceil(totalTemplatesCount / 10)
  const templates = await prisma.template.findMany({
    where: {
      AND: {
        departmentId,
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
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

export const copyTemplate = async (id: string, userId: string) => {
  const template = await prisma.template.findUnique({
    where: {
      id,
    },
  })

  if (!template) {
    throw new Error('Template not found')
  }

  // TODO: update unique name
  const newTemplate = await prisma.template.create({
    data: {
      title: template.title,
      description: template.description,
      templateFile: template.templateFile,
      exampleFile: template.exampleFile,
      createdBy: userId,
      updatedBy: userId,
      departmentId: template.departmentId,
      element: {},
    },
  })

  const templateOperators = await prisma.templateOperator.findMany({
    where: {
      templateId: id,
    },
  })

  await Promise.all(
    templateOperators.map((templateOperator) =>
      prisma.templateOperator.create({
        data: {
          templateId: newTemplate.id,
          operatorId: templateOperator.operatorId,
        },
      })
    )
  )

  return newTemplate
}

export const getOperatorsByTemplateId = async (templateId: string) => {
  const operators = await prisma.templateOperator.findMany({
    where: {
      templateId,
    },
    include: {
      operator: true,
    },
  })

  return operators
}
