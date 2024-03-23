import {
  createTemplate,
  deleteTemplate,
  getDepartmentTemplates,
  updateTemplate,
} from 'controllers/TemplateController'
import Router from 'express'
import { validateToken } from 'middlewares/validateToken'

const template = Router()

template.post('/', validateToken, createTemplate)
template.put('/', validateToken, updateTemplate)
template.delete('/:id', validateToken, deleteTemplate)
template.get('/', validateToken, getDepartmentTemplates)

export default template
