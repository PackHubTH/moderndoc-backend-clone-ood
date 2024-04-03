import {
  createDocument,
  documentAction,
  getDocumentById,
  getDocumentList,
  sendDocumentToOperator,
} from 'controllers/DocumentController'
import Router from 'express'
import { validateToken } from 'middlewares/validateToken'

const document = Router()

document.post('/', validateToken, createDocument)
document.post('/assign-operator', validateToken, sendDocumentToOperator)
document.post('/action', validateToken, documentAction)

document.get('/', validateToken, getDocumentList)
document.get('/:documentId', validateToken, getDocumentById)
// document.put('/:id',updateDocument)
// document.post('/share-document',shareDocument)
// document.get('/timeline',getAllDocumentsTimeline)

export default document
