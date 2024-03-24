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
    },
  })

  return template
}

export const deleteTemplateById = async (id: string) => {
  const template = await prisma.template.delete({
    where: {
      id,
    },
  })

  return template
}
