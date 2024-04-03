import prisma from '@prisma'

import {
  CreateFaqParams,
  CreateSubFaqParams,
  UpdateFaqParams,
  UpdateSubFaqParams,
} from './types'

export const getFaqById = async (id: string) => {
  const faq = await prisma.faq.findUnique({
    where: {
      id,
    },
  })

  return faq
}

export const createFaq = async (params: CreateFaqParams) => {
  const faq = await prisma.faq.create({
    data: {
      titleTh: params.titleTh,
      titleEn: params.titleEn,
      documentCodeTh: params.documentCodeTh,
      documentCodeEn: params.documentCodeEn,
      sendChannel: params.sendChannel,
      sendChannelInfo: params.sendChannelInfo,
      description: params.description,
      files: params.files,
      isInternal: params.isInternal,
      departmentId: params.departmentId,
      templateId: params.templateId,
      extraContact: params.extraContact!,
      updatedBy: params.userId,
      createdBy: params.userId,
    },
  })

  return faq
}

export const updateFaq = async (params: UpdateFaqParams) => {
  const faq = await prisma.faq.update({
    where: {
      id: params.id,
    },
    data: {
      id: params.id,
      titleTh: params.titleTh,
      titleEn: params.titleEn,
      documentCodeTh: params.documentCodeTh,
      documentCodeEn: params.documentCodeEn,
      sendChannel: params.sendChannel,
      sendChannelInfo: params.sendChannelInfo,
      description: params.description,
      files: params.files,
      isInternal: params.isInternal,
      templateId: params.templateId,
      extraContact: params.extraContact!,
      updatedBy: params.userId,
    },
  })

  return faq
}

export const resetFaqTags = async (faqId: string) => {
  await prisma.faqTag.deleteMany({
    where: {
      faqId,
    },
  })
}

export const addFaqTags = async (faqId: string, tagIds: string[]) => {
  const faqTags = tagIds.map((tagId) => {
    return {
      faqId,
      tagId,
    }
  })

  await prisma.faqTag.createMany({
    data: faqTags,
  })
}

export const getAllFaq = async () => {
  const faqs = await prisma.faq.findMany({
    include: {
      subFaqs: true,
      faqTags: true,
    },
  })

  return faqs
}

export const getAllPublicFaqs = async (
  departmentId: string,
  page: number = 1
) => {
  const totalFaqsCount = await prisma.faq.count({
    where: {
      OR: [{ departmentId }, { isInternal: false }],
    },
  })
  const totalPages = Math.ceil(totalFaqsCount / 10)
  const faqs = await prisma.faq.findMany({
    where: {
      OR: [{ departmentId }, { isInternal: false }],
    },
    include: {
      subFaqs: true,
      faqTags: {
        include: {
          tag: true,
        },
      },
      template: true,
      department: true,
      userUpdated: {
        select: {
          nameTh: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
    orderBy: {
      departmentId: 'asc',
    },
  })

  return {
    faqs: faqs,
    totalPages: totalPages,
    totalFaqsCount: totalFaqsCount,
  }
}

export const getAllDepartmentFaqs = async (
  departmentId: string,
  page: number = 1
) => {
  const totalFaqsCount = await prisma.faq.count({
    where: {
      departmentId,
    },
  })
  const totalPages = Math.ceil(totalFaqsCount / 10)
  const faqs = await prisma.faq.findMany({
    where: {
      departmentId,
    },
    include: {
      subFaqs: true,
      faqTags: {
        include: {
          tag: true,
        },
      },
      department: true,
      userUpdated: {
        select: {
          nameTh: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  return {
    data: faqs,
    totalPages: totalPages,
    total: totalFaqsCount,
  }
}

export const createSubFaq = async (params: CreateSubFaqParams) => {
  const subFaq = await prisma.subFaq.create({
    data: {
      faqId: params.faqId,
      title: params.title,
      description: params.description,
      createdBy: params.userId,
      updatedBy: params.userId,
    },
  })

  return subFaq
}

export const updateSubFaq = async (params: UpdateSubFaqParams) => {
  const subFaq = await prisma.subFaq.update({
    where: {
      id: params.id,
    },
    data: {
      title: params.title,
      description: params.description,
      updatedBy: params.userId,
    },
  })

  return subFaq
}

export const getSubFaqById = async (id: string) => {
  const subFaq = await prisma.subFaq.findUnique({
    where: {
      id,
    },
  })

  return subFaq
}

export const deleteSubFaqById = async (id: string) => {
  await prisma.subFaq.delete({
    where: {
      id,
    },
  })
}

export const deleteFaqById = async (id: string) => {
  await prisma.faq.delete({
    where: {
      id,
    },
  })
}

export const getFaqsByTemplateId = async (templateId: string) => {
  const faqs = await prisma.faq.findMany({
    where: {
      templateId,
    },
  })

  return faqs
}
