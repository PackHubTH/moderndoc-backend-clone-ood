import { Tag } from '@prisma/client'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from 'models/response'
import * as TagRepository from 'repository/TagRepository'

import {
  createTagRequestSchema,
  deleteTagRequestSchema,
  updateTagRequestSchema,
} from './types'

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = await createTagRequestSchema.parseAsync(req.body)

    const tag = await TagRepository.createTag(name)

    const response: ApiResponse<Tag> = {
      data: tag,
      message: 'Successfully created tag',
      error: null,
    }

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to create tag',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { tagId, name } = await updateTagRequestSchema.parseAsync(req.body)

    const tag = await TagRepository.changeTagName(tagId, name)

    const response: ApiResponse<Tag> = {
      data: tag,
      message: 'Successfully updated tag',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to update tag',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { tagId } = await deleteTagRequestSchema.parseAsync(req.params)

    const tag = await TagRepository.deleteTag(tagId)

    const response: ApiResponse<Tag> = {
      data: tag,
      message: 'Successfully deleted tag',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to delete tag',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await TagRepository.getAllTags()

    const response: ApiResponse<Tag[]> = {
      data: tags,
      message: 'Successfully retrieved tags',
      error: null,
    }

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      message: 'Failed to retrieve tags',
      error: error,
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}
