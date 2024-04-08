import prisma from '@prisma'
import { DocumentSentStatus, DocumentStatus, Template } from '@prisma/client'
import { Document } from '@prisma/client'
import { CreateDocumentRequest } from 'controllers/DocumentController/types'

import { CreateDocumentSentParams, CreateDocumentTimeline } from './types'

export const createDocument = async (
  params: CreateDocumentRequest,
  template: Template
) => {
  const document = await prisma.document.create({
    data: {
      createdBy: params.userId,
      updatedBy: params.userId,
      status: params.documentStatus,
      description: template.description,
      templateFile: template.templateFile,
      exampleFile: template.exampleFile ?? '',
      title: template.title,
      element: template.element ?? {},
    },
  })

  return document
}

export const getDocumentById = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      documentSents: true,
      documentTimelines: true,
    },
  })

  return document
}

export const updateDocument = async (document: Document) => {
  const updatedDocument = await prisma.document.update({
    where: {
      id: document.id,
    },
    data: {
      ...document,
      element: document.element ?? {},
    },
  })

  return updatedDocument
}

export const getAllDocumentDataById = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      documentSents: {
        include: {
          sender: {
            select: {
              nameTh: true,
              nameEn: true,
              profileImg: true,
              emails: true,
              defaultEmailIndex: true,
            },
          },
          receiver: {
            select: {
              nameTh: true,
              nameEn: true,
              profileImg: true,
              emails: true,
              defaultEmailIndex: true,
            },
          },
        },
      },
      documentTimelines: {
        where: {
          message: {
            not: '',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          userUpdatedBy: {
            select: {
              nameTh: true,
              nameEn: true,
              profileImg: true,
              emails: true,
              defaultEmailIndex: true,
            },
          },
        },
      },
    },
  })

  return document
}

export const createDocumentSend = async (params: CreateDocumentSentParams) => {
  const currentSentToReceiver = await prisma.documentSent.findMany({
    where: {
      documentId: params.documentId,
      receiverId: params.receiverId,
      status: {
        not: DocumentSentStatus.COMPLETED,
      },
    },
  })

  if (currentSentToReceiver.length > 0) {
    throw new Error(
      'Make sure the current document sent is completed before sending it again'
    )
  }

  const documentSent = await prisma.documentSent.create({
    data: {
      documentId: params.documentId,
      senderId: params.senderId,
      receiverId: params.receiverId,
      isEditable: params.isEditable,
      status: params.status,
    },
  })

  return documentSent
}

export const updateDocumentStatus = async (
  documentId: string,
  status: DocumentStatus,
  userId: string
) => {
  const document = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      status,
      updatedBy: userId,
    },
  })

  return document
}

export const getLatestDocumentSent = async (
  documentId: string,
  receiverId: string
) => {
  const documentSent = await prisma.documentSent.findFirst({
    where: {
      documentId,
      receiverId,
    },
    orderBy: {
      sendAt: 'desc',
    },
  })

  if (!documentSent) {
    throw new Error('Document sent not found')
  }

  return documentSent
}

export const updateDocumentSentStatus = async (
  documentId: string,
  receiverId: string,
  status: DocumentSentStatus
) => {
  const documentSent = await getLatestDocumentSent(documentId, receiverId)

  await prisma.documentSent.update({
    where: {
      id: documentSent.id,
    },
    data: {
      status,
    },
  })

  await prisma.document.update({
    where: {
      id: documentSent.documentId,
    },
    data: {
      lastUpdatedAt: new Date(),
      updatedBy: documentSent.receiverId,
    },
  })

  return documentSent
}

export const createDocumentTimeline = async (
  params: CreateDocumentTimeline
) => {
  const documentTimeline = await prisma.documentTimeline.create({
    data: {
      documentId: params.documentId,
      status: params.status,
      message: params.message,
      userId: params.userId,
      updatedBy: params.updatedBy,
    },
  })

  return documentTimeline
}

export const getAllUserDocuments = async (userId: string, page: number = 1) => {
  const totalDocumentsCount = await prisma.document.count({
    where: {
      OR: [
        {
          createdBy: userId,
        },
        {
          documentSents: {
            some: {
              receiverId: userId,
            },
          },
        },
      ],
    },
  })
  const totalPages = Math.ceil(totalDocumentsCount / 10)
  const documents = await prisma.document.findMany({
    where: {
      OR: [
        {
          createdBy: userId,
        },
        {
          documentSents: {
            some: {
              receiverId: userId,
            },
          },
        },
      ],
    },
    include: {
      userCreated: {
        select: {
          nameTh: true,
          nameEn: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
      operator: {
        select: {
          nameTh: true,
          nameEn: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
      documentSents: {
        where: {
          receiverId: userId,
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  return {
    data: documents,
    totalPages: totalPages,
    total: totalDocumentsCount,
  }
}

export const getDocumentsReceived = async (
  userId: string,
  page: number = 1
) => {
  const totalDocumentsCount = await prisma.document.count({
    where: {
      documentSents: {
        some: {
          receiverId: userId,
        },
      },
    },
  })
  const totalPages = Math.ceil(totalDocumentsCount / 10)
  const documents = await prisma.document.findMany({
    where: {
      documentSents: {
        some: {
          receiverId: userId,
        },
      },
    },
    include: {
      userCreated: {
        select: {
          nameTh: true,
          nameEn: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
      operator: {
        select: {
          nameTh: true,
          nameEn: true,
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
    data: documents,
    totalPages: totalPages,
    total: totalDocumentsCount,
  }
}

export const getDocumentsSent = async (userId: string, page: number = 1) => {
  const totalDocumentsCount = await prisma.document.count({
    where: {
      createdBy: userId,
    },
  })
  const totalPages = Math.ceil(totalDocumentsCount / 10)
  const documents = await prisma.document.findMany({
    include: {
      userCreated: {
        select: {
          nameTh: true,
          nameEn: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
      operator: {
        select: {
          nameTh: true,
          nameEn: true,
          emails: true,
          defaultEmailIndex: true,
          profileImg: true,
        },
      },
    },
    where: {
      createdBy: userId,
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  return {
    data: documents,
    totalPages: totalPages,
    total: totalDocumentsCount,
  }
}

export const updateDocumentElement = async (
  documentId: string,
  element: object,
  userId: string
) => {
  const document = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      element: element,
      updatedBy: userId,
    },
  })

  return document
}

export const getUserTimelines = async (userId: string, page: number = 1) => {
  const totalTimelineCount = await prisma.documentTimeline.count({
    where: {
      userId,
    },
  })
  const totalPages = Math.ceil(totalTimelineCount / 10)
  const timelines = await prisma.documentTimeline.findMany({
    where: {
      userId,
    },
    include: {
      document: {
        select: {
          title: true,
          description: true,
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    data: timelines,
    totalPages: totalPages,
    total: totalTimelineCount,
  }
}
