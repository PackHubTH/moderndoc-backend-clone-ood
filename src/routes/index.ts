import { Router } from 'express'
import user from 'routes/user'

const routes = Router()

routes.use('/user', user)

export default routes
