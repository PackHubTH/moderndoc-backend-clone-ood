import { getAllAgencyDepartments } from 'controllers/DepartmentController'
import Router from 'express'

const department = Router()

department.get('/', getAllAgencyDepartments)

export default department
