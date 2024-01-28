import { Router } from 'express'

import departmentRoutes from './departmentRoutes'
import facultyRoutes from './facultyRoutes'
import tagRoutes from './tagRoutes'
import userRoutes from './userRoutes'

const routes = Router()

routes.use('/user', userRoutes)
routes.use('/faculty', facultyRoutes)
routes.use('/department', departmentRoutes)
routes.use('/tag', tagRoutes)

export default routes
