import { getCoursesByDepartmentId } from 'controllers/CourseController'
import Router from 'express'

const course = Router()

course.get('/department/:departmentId', getCoursesByDepartmentId)

export default course
