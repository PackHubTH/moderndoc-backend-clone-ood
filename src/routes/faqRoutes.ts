import {
  createFaq,
  createSubFaq,
  deleteFaq,
  deleteSubFaq,
  getAllFaqs,
  getDepartmentFaqs,
  updateFaq,
  updateSubFaq,
} from 'controllers/FaqController'
import Router from 'express'
import { validateToken } from 'middlewares/validateToken'

const faq = Router()

faq.post('/', validateToken, createFaq)
faq.put('/', validateToken, updateFaq)

faq.post('/sub-faq', validateToken, createSubFaq)
faq.put('/sub-faq', validateToken, updateSubFaq)
faq.delete('/sub-faq/:subFaqId', validateToken, deleteSubFaq)

faq.delete('/:id', validateToken, deleteFaq)

faq.get('/', validateToken, getAllFaqs)
faq.get('/department', validateToken, getDepartmentFaqs)
// faq.get('/:id',getFaqById)
// faq.get('tag/:id',getFaqsByTag)

export default faq
