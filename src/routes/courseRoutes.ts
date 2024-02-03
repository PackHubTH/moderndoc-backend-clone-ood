import { getCoursesByDepartmentId } from 'controllers/CourseController'
import Router from 'express'

const course = Router()

course.get('/', getCoursesByDepartmentId)

export default course
