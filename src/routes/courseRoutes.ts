import {
  getCourseById,
  getCoursesByDepartmentId,
} from 'controllers/CourseController'
import Router from 'express'

const course = Router()

course.get('/', getCoursesByDepartmentId)
course.get('/:id', getCourseById)

export default course
