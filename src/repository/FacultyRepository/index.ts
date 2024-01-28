import prisma from '@prisma'
import { Faculty } from '@prisma/client'

export const getAllFaculties = async (): Promise<Faculty[]> => {
  const faculties = await prisma.faculty.findMany()

  return faculties
}
