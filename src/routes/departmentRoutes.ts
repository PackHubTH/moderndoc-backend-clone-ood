import {
  getAllAgencyDepartments,
  getDepartmentsByFacultyId,
} from 'controllers/DepartmentController'
import Router from 'express'

const department = Router()

department.get('/', getAllAgencyDepartments)
department.get('/faculty/:facultyId', getDepartmentsByFacultyId)

export default department
