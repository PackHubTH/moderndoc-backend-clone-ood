import { Document } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as DocumentService from 'services/DocumentService'

import {
  CreateDocumentRequestSchema,
  DocumentActionRequestSchema,
  DocumentSentToOperatorRequestSchema,
  GetDocumentByIdRequestSchema,
  GetDocumentListRequestSchema,
} from './types'

export const createDocument = async (req: Request, res: Response) => {
  try {
    const request = await CreateDocumentRequestSchema.parseAsync({
      ...req.body,
      userId: req.headers.userId,
    })

    const document = await DocumentService.createDocument(request)

    const response: ApiResponse<Document> = {
      data: document,
      message: 'Document created successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to create document',
      error: error,
    }

    res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const sendDocumentToOperator = async (req: Request, res: Response) => {
  try {
    const request = await DocumentSentToOperatorRequestSchema.parseAsync({
      ...req.body,
      userId: req.headers.userId,
    })

    const document = await DocumentService.sendDocumentToOperator(request)

    const response: ApiResponse<Document> = {
      data: document,
      message: 'Document sent to operator successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to send document to operator',
      error: error,
    }

    res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getDocumentList = async (req: Request, res: Response) => {
  try {
    const { userId, page, type } =
      await GetDocumentListRequestSchema.parseAsync({
        ...req.query,
        page: Number(req.query.page),
        userId: req.headers.userId,
      })

    const documents = await DocumentService.getDocumentsList(userId, page, type)

    const response: ApiResponse<Document[]> = {
      data: documents.data,
      message: 'Documents fetched successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to fetch documents',
      error: error,
    }

    res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { userId, documentId } =
      await GetDocumentByIdRequestSchema.parseAsync({
        ...req.params,
        userId: req.headers.userId,
      })

    const document = await DocumentService.getDocumentById(userId, documentId)

    const response: ApiResponse<Document> = {
      data: document,
      message: 'Document fetched successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to fetch document',
      error: error,
    }

    res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const documentAction = async (req: Request, res: Response) => {
  try {
    const request = await DocumentActionRequestSchema.parseAsync({
      ...req.body,
      userId: req.headers.userId,
    })

    const document = await DocumentService.documentAction(request)

    const response: ApiResponse<Document> = {
      data: document,
      message: 'Document action performed successfully',
    }

    res.json(response).status(StatusCodes.OK)
  } catch (error) {
    console.error(error)
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to perform document action',
      error: error,
    }

    res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
