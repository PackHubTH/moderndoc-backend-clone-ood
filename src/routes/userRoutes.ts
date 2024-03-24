import {
  getTeachersByName,
  getUser,
  getUsersByDepartmentId,
  login,
  registerStaff,
  registerStudent,
  registerTeacher,
  updatedUser,
} from 'controllers/UserController'

import Router from 'express'
import { validateToken } from 'middlewares/validateToken'

const user = Router()

user.put('/', updatedUser)
user.get('/', validateToken, getUser)

user.post('/login', login)

user.post('/student', registerStudent)

user.post('/staff', registerStaff)

user.post('/teacher', registerTeacher)
user.get('/teacher', getTeachersByName)

user.get('/department/:id', validateToken, getUsersByDepartmentId)

export default user
