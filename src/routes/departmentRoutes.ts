import {
  addAgencyDepartment,
  approveDepartmentMember,
  getAllAgencyDepartments,
  getDepartmentById,
  getDepartmentMembers,
  updateDepartment,
} from 'controllers/DepartmentController'
import Router from 'express'
import { validateToken } from 'middlewares/validateToken'

const department = Router()

department.get('/members', validateToken, getDepartmentMembers)
department.put('/approve-member', validateToken, approveDepartmentMember)
department.get('/', getAllAgencyDepartments)
department.get('/:id', getDepartmentById)
department.post('/agency', addAgencyDepartment)
department.put('/', updateDepartment)

export default department
