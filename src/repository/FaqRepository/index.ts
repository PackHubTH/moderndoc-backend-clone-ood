import prisma from '@prisma'

import { CreateFaqParams } from './types'

export const createFaq = async (params: CreateFaqParams) => {
  const faq = await prisma.faq.create({
    data: params,
  })

  return faq
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
