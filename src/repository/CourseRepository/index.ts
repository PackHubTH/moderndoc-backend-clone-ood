import prisma from '@prisma'

export const getCoursesByDepartmentId = async (departmentId: string) => {
  const courses = await prisma.course.findMany({
    where: {
      departmentId,
    },
  })

  return courses
}
