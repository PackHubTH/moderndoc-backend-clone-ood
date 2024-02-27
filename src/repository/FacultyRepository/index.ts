import prisma from '@prisma'
import { Faculty } from '@prisma/client'

export const getAllFaculties = async (): Promise<Faculty[]> => {
  const faculties = await prisma.faculty.findMany()

  return faculties
}

export const getFacultyById = async (id: string): Promise<Faculty | null> => {
  const faculty = await prisma.faculty.findFirst({
    where: {
      id,
    },
  })

  return faculty
}
