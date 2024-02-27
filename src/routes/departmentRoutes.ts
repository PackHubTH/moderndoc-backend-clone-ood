import {
  getAllAgencyDepartments,
  getDepartmentById,
} from 'controllers/DepartmentController'
import Router from 'express'

const department = Router()

department.get('/', getAllAgencyDepartments)
department.get('/:id', getDepartmentById)

export default department
