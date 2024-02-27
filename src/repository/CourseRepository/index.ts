import prisma from '@prisma'
import { Level } from '@prisma/client'
import { getDepartmentById } from 'repository/DepartmentRepository'
import { getFacultyById } from 'repository/FacultyRepository'

export const getCoursesByDepartmentId = async (
  departmentId: string,
  level?: Level
) => {
  if (level)
    return await prisma.course.findMany({
      where: {
        departmentId,
        level,
      },
    })

  return await prisma.course.findMany({
    where: {
      departmentId,
    },
  })
}

export const getCourseById = async (id: string) => {
  const course = await prisma.course.findFirst({
    where: {
      id,
    },
  })

  if (!course) return

  const department = await getDepartmentById(course.departmentId)

  if (!department)
    return {
      ...course,
      department: null,
    }

  const faculty = department.facultyId
    ? await getFacultyById(department.facultyId)
    : null

  return {
    ...course,
    department: department,
    faculty: faculty,
  }
}
