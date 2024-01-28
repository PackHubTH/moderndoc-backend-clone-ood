import { getAllFaculties } from 'controllers/FacultyController'
import Router from 'express'

const faculty = Router()

faculty.get('/', getAllFaculties)

export default faculty
