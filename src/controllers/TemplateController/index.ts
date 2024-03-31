import * as TemplateService from 'services/TemplateService'

import {
  CreateTemplateSchema,
  DeleteTemplateSchema,
  GetDepartmentTemplatesSchema,
  UpdateTemplateSchema,
} from './types'
import { Request, Response } from 'express'

import { ApiResponse } from 'models/response'
import { StatusCodes } from 'http-status-codes'

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const request = await CreateTemplateSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    const template = await TemplateService.createTemplate(request)

    const response: ApiResponse<unknown> = {
      data: template,
      message: 'Successfully created template',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: error as string,
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getDepartmentTemplates = async (req: Request, res: Response) => {
  try {
    const request = await GetDepartmentTemplatesSchema.parseAsync({
      ...req.headers,
      page: Number(req.query.page),
    })

    const templates = await TemplateService.GetDepartmentTemplates(request)

    const response: ApiResponse<unknown> = {
      data: templates,
      message: 'Successfully fetched templates',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: error as string,
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const request = await UpdateTemplateSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    const template = await TemplateService.UpdateTemplate(request)

    const response: ApiResponse<unknown> = {
      data: template,
      message: 'Successfully updated template',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: error as string,
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const request = await DeleteTemplateSchema.parseAsync({
      id: req.params.id,
      ...req.headers,
    })

    await TemplateService.DeleteTemplate(request)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully deleted template',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: error as string,
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
