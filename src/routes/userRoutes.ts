import {
  getUserById,
  registerStaff,
  registerStudent,
  registerTeacher,
} from 'controllers/UserController'
import Router from 'express'

const user = Router()

user.get('/:userId', getUserById)
user.post('/student', registerStudent)
user.post('/staff', registerStaff)
user.post('/teacher', registerTeacher)
// user.put('/',updateUser)

export default user
