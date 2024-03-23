import { uploadFile } from 'controllers/FileController'
import { Router } from 'express'
import { upload } from 'middlewares/file'
import { validateToken } from 'middlewares/validateToken'

import courseRoutes from './courseRoutes'
import departmentRoutes from './departmentRoutes'
import facultyRoutes from './facultyRoutes'
import faqRoutes from './faqRoutes'
import tagRoutes from './tagRoutes'
import templateRoutes from './templateRoutes'
import userRoutes from './userRoutes'

const routes = Router()

routes.use('/user', userRoutes)
routes.use('/faculty', facultyRoutes)
routes.use('/department', departmentRoutes)
routes.use('/course', courseRoutes)
routes.use('/tag', tagRoutes)
routes.use('/faq', faqRoutes)
routes.use('/template', templateRoutes)

routes.post('/upload-file', [validateToken, upload.single('file'), uploadFile])

export default routes
