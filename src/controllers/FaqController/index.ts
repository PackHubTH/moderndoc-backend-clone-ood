import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as FaqService from 'services/FaqService'

import {
  CreateFaqRequestSchema,
  CreateSubFaqRequestSchema,
  DeleteSubFaqRequestSchema,
  GetAllFaqsRequestSchema,
  UpdateFaqRequestSchema,
  UpdateSubFaqRequestSchema,
} from './types'

export const createFaq = async (req: Request, res: Response) => {
  try {
    const request = await CreateFaqRequestSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    await FaqService.createFaq(request)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully created faq',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const request = await UpdateFaqRequestSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    await FaqService.updateFaq(request)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully updated faq',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getAllFaqs = async (req: Request, res: Response) => {
  try {
    const { userId, page } = await GetAllFaqsRequestSchema.parseAsync({
      userId: req.headers.userId,
      page: Number(req.query.page),
    })

    const faqs = await FaqService.getAllFaqs(userId, page)

    const response: ApiResponse<null> = {
      data: faqs,
      message: 'Successfully retrieved faqs',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getDepartmentFaqs = async (req: Request, res: Response) => {
  try {
    const { userId, page } = await GetAllFaqsRequestSchema.parseAsync({
      userId: req.headers.userId,
      page: Number(req.query.page),
    })

    const faqs = await FaqService.getDepartmentFaqs(userId, page)

    const response: ApiResponse<null> = {
      data: faqs,
      message: 'Successfully retrieved faqs',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const createSubFaq = async (req: Request, res: Response) => {
  try {
    const request = await CreateSubFaqRequestSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    await FaqService.createSubFaq(request)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully created sub faq',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const updateSubFaq = async (req: Request, res: Response) => {
  try {
    const request = await UpdateSubFaqRequestSchema.parseAsync({
      ...req.body,
      ...req.headers,
    })

    await FaqService.updateSubFaq(request)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully updated sub faq',
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

export const deleteSubFaq = async (req: Request, res: Response) => {
  try {
    const { subFaqId, userId } = await DeleteSubFaqRequestSchema.parseAsync({
      subFaqId: req.params.subFaqId,
      userId: req.headers.userId,
    })

    await FaqService.deleteSubFaq(subFaqId, userId)

    const response: ApiResponse<null> = {
      data: null,
      message: 'Successfully deleted sub faq',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Invalid request body',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
