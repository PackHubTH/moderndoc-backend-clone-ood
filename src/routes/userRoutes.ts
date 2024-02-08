import {
  login,
  registerStaff,
  registerStudent,
  registerTeacher,
} from 'controllers/UserController'
import Router from 'express'

const user = Router()

user.post('/student', registerStudent)
user.post('/staff', registerStaff)
user.post('/teacher', registerTeacher)
// user.post('/',updateUser)
user.post('/login', login)

export default user
