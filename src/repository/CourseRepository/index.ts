import prisma from '@prisma'
import { Level } from '@prisma/client'

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
