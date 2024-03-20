import {
  addAgencyDepartment,
  getAllAgencyDepartments,
  getDepartmentById,
  updateDepartment,
} from 'controllers/DepartmentController'
import Router from 'express'

const department = Router()

department.get('/', getAllAgencyDepartments)
department.get('/:id', getDepartmentById)
department.post('/agency', addAgencyDepartment)
department.put('/', updateDepartment)

export default department
