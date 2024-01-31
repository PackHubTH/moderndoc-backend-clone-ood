import prisma from '@prisma'
import { Tag } from '@prisma/client'

export const createTag = async (name: string): Promise<Tag> => {
  const newTag = await prisma.tag.create({
    data: {
      name: name,
    },
  })

  return newTag
}

export const changeTagName = async (
  tagId: string,
  name: string
): Promise<Tag> => {
  const newTag = await prisma.tag.update({
    where: {
      id: tagId,
    },
    data: {
      name: name,
    },
  })

  return newTag
}

export const deleteTag = async (tagId: string): Promise<Tag> => {
  const newTag = await prisma.tag.delete({
    where: {
      id: tagId,
    },
  })

  return newTag
}

export const getAllTags = async (): Promise<Tag[]> => {
  const tags = await prisma.tag.findMany()

  return tags
}
