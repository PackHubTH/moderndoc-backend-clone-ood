import * as TemplateRepo from 'repository/TemplateRepository'
import * as UserService from 'services/UserService'

import {
  CreateTemplateRequest,
  DeleteTemplateRequest,
  GetDepartmentTemplatesRequest,
  UpdateTemplateRequest,
} from 'controllers/TemplateController/types'

export const createTemplate = async (params: CreateTemplateRequest) => {
  const departmentId = await UserService.getUserDepartmentId(
    params.userId,
    true
  )
  const template = await TemplateRepo.createTemplate({
    ...params,
    departmentId,
    element: {},
    exampleFile: params.exampleFile || '',
  })

  return template
}

export const GetDepartmentTemplates = async (
  params: GetDepartmentTemplatesRequest
) => {
  const departmentId = await UserService.getUserDepartmentId(
    params.userId,
    true
  )

  const templates = await TemplateRepo.getDepartmentTemplates(
    departmentId,
    params.page
  )

  return templates
}

export const UpdateTemplate = async (params: UpdateTemplateRequest) => {
  const departmentId = await UserService.getUserDepartmentId(
    params.userId,
    true
  )

  const template = await TemplateRepo.getTemplateById(params.id)

  if (!template) {
    throw new Error('Template not found')
  }

  if (template.departmentId !== departmentId) {
    throw new Error('You are not allowed to update this template')
  }

  const updatedTemplate = await TemplateRepo.updateTemplateById({
    ...params,
    departmentId,
    element: {},
  })

  return updatedTemplate
}

export const DeleteTemplate = async (params: DeleteTemplateRequest) => {
  const departmentId = await UserService.getUserDepartmentId(
    params.userId,
    true
  )

  const template = await TemplateRepo.getTemplateById(params.id)

  if (!template) {
    throw new Error('Template not found')
  }

  if (template.departmentId !== departmentId) {
    throw new Error('You are not allowed to delete this template')
  }

  await TemplateRepo.deleteTemplateById(params.id)

  return true
}
