import { getSomeUser } from 'controllers/user'
import Router from 'express'
import { logTime } from 'middlewares/logging'

const user = Router()

user.get('/random-user', logTime, getSomeUser)

// user.post('/',registerUser)
// user.put('/',updateUser)

export default user
