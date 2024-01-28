import prisma from '@prisma'
import { Department } from '@prisma/client'

export const getDepartmentsByFacultyId = async (
  facultyId: bigint
): Promise<Department[]> => {
  const departments = await prisma.department.findMany({
    where: {
      facultyId,
    },
  })

  return departments
}

export const getAllAgencyDepartments = async (): Promise<Department[]> => {
  const department = await prisma.department.findMany({
    where: {
      facultyId: null,
    },
  })

  return department
}
