import { Role } from '@prisma/client'
import * as FaqRepository from 'repository/FaqRepository'
import { CreateFaqParams } from 'repository/FaqRepository/types'
import { getUserById, getUserDepartmentId } from 'services/UserService'

import {
  CreateFaqRequest,
  CreateSubFaqRequest,
  UpdateFaqRequest,
  UpdateSubFaqRequest,
} from './../../controllers/FaqController/types'
import { UpdateFaqParams } from './../../repository/FaqRepository/types'

export const createFaq = async (params: CreateFaqRequest) => {
  const user = await getUserById(params.userId)

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId

  if (!departmentId) throw new Error('Staff no department')

  const myFaq: CreateFaqParams = {
    userId: params.userId,
    titleTh: params.titleTh,
    titleEn: params.titleEn,
    documentCodeTh: params.documentCodeTh,
    documentCodeEn: params.documentCodeEn,
    sendChannel: params.sendChannel,
    sendChannelInfo: params.sendChannelInfo,
    description: params.description,
    files: params.files,
    extraContact: params.extraContact,
    isInternal: params.isInternal,
    templateId: params.templateId ?? null,
    departmentId: departmentId,
  }

  const faq = await FaqRepository.createFaq(myFaq)

  if (params.tagIds) await FaqRepository.addFaqTags(faq.id, params.tagIds)

  return faq
}

export const updateFaq = async (params: UpdateFaqRequest) => {
  const user = await getUserById(params.userId)

  const faq = await FaqRepository.getFaqById(params.id)

  if (!faq) throw new Error('Faq not found')

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId

  if (!departmentId) throw new Error('Staff no department')

  if (user.role !== Role.ADMIN && faq.departmentId !== departmentId)
    throw new Error('Faq not in your department')

  const myFaq: UpdateFaqParams = {
    id: params.id,
    userId: params.userId,
    titleTh: params.titleTh,
    titleEn: params.titleEn,
    documentCodeTh: params.documentCodeTh,
    documentCodeEn: params.documentCodeEn,
    sendChannel: params.sendChannel,
    sendChannelInfo: params.sendChannelInfo,
    description: params.description,
    files: params.files,
    extraContact: params.extraContact,
    isInternal: params.isInternal,
    templateId: params.templateId ?? null,
  }

  const result = await FaqRepository.updateFaq(myFaq)

  if (params.tagIds) {
    await FaqRepository.resetFaqTags(result.id)
    await FaqRepository.addFaqTags(result.id, params.tagIds)
  }
  return result
}

export const getAllFaqs = async (
  userId: string,
  page: number,
  search: string
) => {
  const userDepartmentId = await getUserDepartmentId(userId)

  const faqs = await FaqRepository.getAllPublicFaqs(
    userDepartmentId,
    page,
    search
  )

  return faqs
}

export const getDepartmentFaqs = async (
  userId: string,
  page: number,
  search: string
) => {
  const userDepartmentId = await getUserDepartmentId(userId)

  const faqs = await FaqRepository.getAllDepartmentFaqs(
    userDepartmentId,
    page,
    search
  )

  return faqs
}

export const createSubFaq = async (params: CreateSubFaqRequest) => {
  const user = await getUserById(params.userId)

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId
  if (!departmentId) throw new Error('Staff no department')

  const faq = await FaqRepository.getFaqById(params.faqId)
  if (!faq) throw new Error('Faq not found')

  if (user.role !== Role.ADMIN && faq.departmentId !== departmentId)
    throw new Error('Faq not in your department')

  const result = await FaqRepository.createSubFaq(params)

  return result
}

export const updateSubFaq = async (params: UpdateSubFaqRequest) => {
  const user = await getUserById(params.userId)

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId
  if (!departmentId) throw new Error('Staff no department')

  const subFaq = await FaqRepository.getSubFaqById(params.id)
  if (!subFaq) throw new Error('SubFaq not found')

  const faq = await FaqRepository.getFaqById(subFaq.faqId)
  if (!faq) throw new Error('Faq not found')

  if (
    user.role !== Role.STAFF &&
    user.role !== Role.ADMIN &&
    faq.departmentId !== departmentId
  )
    throw new Error('Faq not in your department')

  const result = await FaqRepository.updateSubFaq(params)

  return result
}

export const deleteSubFaq = async (subFaqId: string, userId: string) => {
  const user = await getUserById(userId)

  const subFaq = await FaqRepository.getSubFaqById(subFaqId)
  if (!subFaq) throw new Error('SubFaq not found')

  const faq = await FaqRepository.getFaqById(subFaq.faqId)
  if (!faq) throw new Error('Faq not found')

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId
  if (!departmentId) throw new Error('Staff no department')

  if (user.role !== Role.ADMIN && faq.departmentId !== departmentId)
    throw new Error('Faq not in your department')

  await FaqRepository.deleteSubFaqById(subFaqId)
}

export const deleteFaq = async (faqId: string, userId: string) => {
  const user = await getUserById(userId)

  const faq = await FaqRepository.getFaqById(faqId)
  if (!faq) throw new Error('Faq not found')

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId
  if (!departmentId) throw new Error('Staff no department')

  if (user.role !== Role.ADMIN && faq.departmentId !== departmentId)
    throw new Error('Faq not in your department')

  await FaqRepository.deleteFaqById(faqId)
}
