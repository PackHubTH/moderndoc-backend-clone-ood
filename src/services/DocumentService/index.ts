import { DocumentSentStatus, DocumentStatus } from '@prisma/client'
import {
  CreateDocumentRequest,
  DocumentActionRequest,
  DocumentListType,
  DocumentSentToOperatorRequest,
} from 'controllers/DocumentController/types'
import * as DocumentRepo from 'repository/DocumentRepository'
import { getFaqsByTemplateId } from 'repository/FaqRepository'
import { getTemplateById } from 'repository/TemplateRepository'
import { getUserDepartmentId } from 'services/UserService'

export const isTemplateAvailableToUser = async (
  userId: string,
  templateId: string
) => {
  const departmentId = await getUserDepartmentId(userId)

  const template = await getFaqsByTemplateId(templateId)

  const isTemplateAvailable = template.some(
    (template) =>
      template.departmentId === departmentId || template.isInternal === false
  )

  return isTemplateAvailable
}

export const createDocument = async (params: CreateDocumentRequest) => {
  const isTemplateAvailable = isTemplateAvailableToUser(
    params.userId,
    params.templateId
  )

  if (!isTemplateAvailable) {
    throw new Error('Template is not available to user')
  }

  const template = await getTemplateById(params.templateId)

  if (!template) {
    throw new Error('Template not found')
  }

  const document = await DocumentRepo.createDocument(params, template)

  return document
}

export const sendDocumentToOperator = async (
  params: DocumentSentToOperatorRequest
) => {
  const document = await DocumentRepo.getDocumentById(params.documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const documentSent = await DocumentRepo.createDocumentSend({
    documentId: params.documentId,
    senderId: params.userId,
    receiverId: params.operatorUserId,
    isEditable: params.isEditable,
    status: DocumentSentStatus.PROCESSING,
  })

  const updatedDocument = await DocumentRepo.updateDocumentStatus(
    params.documentId,
    DocumentStatus.PROCESSING,
    params.userId
  )

  updatedDocument.operatorId = params.operatorUserId
  await DocumentRepo.updateDocument(updatedDocument)

  await updateDocumentTimeline(
    params.documentId,
    params.operatorUserId,
    params.userId,
    params.message,
    DocumentSentStatus.WAITING,
    DocumentSentStatus.PROCESSING
  )

  return documentSent
}

export const documentAction = async (params: DocumentActionRequest) => {
  switch (params.action) {
    case 'SEND_BACK_TO_OWNER':
      await actionSendDocumentBackToOwner(
        params.documentId,
        params.userId,
        params.message
      )
      break
    case 'SEND_TO_OPERATOR':
      await actionSendDocumentToOperator(
        params.documentId,
        params.userId,
        params.message
      )
      break
    case 'SEND_TO_REVIEW':
      await actionSendDocumentToReview(
        params.documentId,
        params.userId,
        params.receiverId,
        params.message
      )
      break
    case 'APPROVE':
      await actionSendDocumentToOperator(
        params.documentId,
        params.userId,
        params.message
      )
      break
    case 'COMPLETE':
      await actionCompleteDocument(
        params.documentId,
        params.userId,
        params.message
      )
      break
    case 'REJECT':
      await actionCancelDocument(
        params.documentId,
        params.userId,
        params.message
      )
      break
  }

  const document = await DocumentRepo.updateDocumentElement(
    params.documentId,
    params.element,
    params.userId
  )

  return document
}

export const actionSendDocumentBackToOwner = async (
  documentId: string,
  senderId: string,
  message: string
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.PROCESSING) {
    throw new Error('Document is not in processing state')
  }

  //create document sent to owner
  const documentSent = await DocumentRepo.createDocumentSend({
    documentId,
    senderId: senderId,
    receiverId: document.createdBy,
    isEditable: true,
    status: DocumentSentStatus.PROCESSING,
  })

  //update operator document status to returning
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.RETURNING
  )

  await updateDocumentTimeline(
    documentId,
    document.createdBy,
    senderId,
    message,
    DocumentSentStatus.RETURNING,
    DocumentSentStatus.WAITING
  )

  return documentSent
}

export const actionSendDocumentToOperator = async (
  documentId: string,
  senderId: string,
  message: string = ''
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.PROCESSING) {
    throw new Error('Document is not in returing or waiting state')
  }

  if (!document.operatorId) {
    throw new Error('Document operator not found')
  }

  //update owner document sent status to completed
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.COMPLETED
  )

  //update operator document sent status to processing
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    document.operatorId,
    DocumentSentStatus.PROCESSING
  )

  await updateDocumentTimeline(
    documentId,
    document.operatorId,
    senderId,
    message,
    DocumentSentStatus.PROCESSING,
    DocumentSentStatus.WAITING
  )

  return
}

export const actionSendBackToOperator = async (
  documentId: string,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.RETURNING) {
    throw new Error('Document is not in returning state')
  }

  //update operator document status to returning
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.WAITING
  )

  await updateDocumentTimeline(
    documentId,
    receiverId,
    senderId,
    message,
    DocumentSentStatus.WAITING,
    DocumentSentStatus.PROCESSING
  )

  return
}

export const actionSendDocumentToReview = async (
  documentId: string,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.PROCESSING) {
    throw new Error('Document is not in processing state')
  }

  //create document sent to review
  const documentSent = await DocumentRepo.createDocumentSend({
    documentId,
    senderId,
    receiverId,
    isEditable: false,
    status: DocumentSentStatus.PROCESSING,
  })

  //update operator document status to returning
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.WAITING
  )

  await updateDocumentTimeline(
    documentId,
    receiverId,
    senderId,
    message,
    DocumentSentStatus.WAITING,
    DocumentSentStatus.PROCESSING
  )

  return documentSent
}

export const actionCancelDocument = async (
  documentId: string,
  senderId: string,
  message: string
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.PROCESSING) {
    throw new Error('Document is not in processing state')
  }

  //update sender document sent status to cancelled
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.CANCELED
  )

  //update operator document status to completed
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    document.operatorId!,
    DocumentSentStatus.COMPLETED
  )

  //update document status to cancelled
  await DocumentRepo.updateDocumentStatus(
    documentId,
    DocumentStatus.CANCELED,
    senderId
  )

  await updateDocumentTimeline(
    documentId,
    document.operatorId!,
    senderId,
    message,
    DocumentSentStatus.CANCELED,
    DocumentSentStatus.CANCELED
  )

  return
}

export const actionCompleteDocument = async (
  documentId: string,
  senderId: string,
  message: string
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  const userDocumentSent = document.documentSents.find(
    (documentSent) => documentSent.receiverId === senderId
  )

  if (!userDocumentSent) {
    throw new Error('Document not found')
  }

  if (userDocumentSent.status !== DocumentSentStatus.PROCESSING) {
    throw new Error('Document is not in processing state')
  }

  //update sender document sent status to completed
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    senderId,
    DocumentSentStatus.COMPLETED
  )

  //update operator document status to completed
  await DocumentRepo.updateDocumentSentStatus(
    documentId,
    document.operatorId!,
    DocumentSentStatus.COMPLETED
  )

  //update document status to completed
  await DocumentRepo.updateDocumentStatus(
    documentId,
    DocumentStatus.COMPLETED,
    senderId
  )

  await updateDocumentTimeline(
    documentId,
    document.operatorId!,
    senderId,
    message,
    DocumentSentStatus.COMPLETED,
    DocumentSentStatus.COMPLETED
  )
}

export const updateDocumentTimeline = async (
  documentId: string,
  receiverId: string,
  senderId: string,
  message: string,
  receiverStatus: DocumentSentStatus,
  othersStatus: DocumentSentStatus
) => {
  const document = await DocumentRepo.getDocumentById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  document.documentSents.forEach(async (documentSent) => {
    const userId = documentSent.receiverId
    const status =
      documentSent.receiverId === receiverId ? receiverStatus : othersStatus
    const timelimeMessage =
      documentSent.receiverId === receiverId ? message : ''

    await DocumentRepo.createDocumentTimeline({
      documentId,
      userId,
      status,
      message: timelimeMessage,
      updatedBy: senderId,
    })
  })

  return
}

export const getDocumentsList = async (
  userId: string,
  page: number = 1,
  type: DocumentListType
) => {
  switch (type) {
    case 'ALL':
      return await DocumentRepo.getAllUserDocuments(userId, page)
    case 'RECEIVED':
      return await DocumentRepo.getDocumentsReceived(userId, page)
    case 'SENT':
      return await DocumentRepo.getDocumentsSent(userId, page)
  }
}

export const getDocumentById = async (userId: string, documentId: string) => {
  const document = await DocumentRepo.getAllDocumentDataById(documentId)

  if (!document) {
    throw new Error('Document not found')
  }

  if (
    document.createdBy !== userId &&
    document.operatorId !== userId &&
    !document.documentSents.some(
      (documentSent) => documentSent.receiverId === userId
    )
  ) {
    throw new Error('Document is not available to you')
  }

  return document
}
