import prisma from '@prisma'

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      staff: true,
      teacher: true,
      student: true,
    },
  })

  return user
}
