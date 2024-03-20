import prisma from '@prisma'
import { Department } from '@prisma/client'

export const getDepartmentsByFacultyId = async (
  facultyId: string
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
      type: 'AGENCY',
    },
  })

  return department
}

export const getDepartmentById = async (
  id: string
): Promise<Department | null> => {
  const department = await prisma.department.findFirst({
    where: {
      id,
    },
    include: {
      faculty: true,
    },
  })

  return department
}

export const addAgencyDepartment = async (
  name: string
): Promise<Department> => {
  const department = await prisma.department.create({
    data: {
      name,
      type: 'AGENCY',
    },
  })

  return department
}

export const updateDepartment = async (departmentId: string, name: string) => {
  const department = await prisma.department.update({
    where: {
      id: departmentId,
    },
    data: {
      name,
    },
  })
  return department
}
