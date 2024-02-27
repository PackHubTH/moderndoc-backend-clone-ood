import prisma from '@prisma'
import { getStaffByUserId } from 'repository/StaffRepository'
import { getStudentByUserId } from 'repository/StudentRepository'
import { getTeacherByUserId } from 'repository/TeacherRepository'

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (user?.role === 'STUDENT') {
    const student = await getStudentByUserId(userId)

    return {
      ...user,
      student: student,
    }
  } else if (user?.role === 'TEACHER') {
    const teacher = await getTeacherByUserId(userId)

    return {
      ...user,
      teacher: teacher,
    }
  } else if (user?.role === 'STAFF' || user?.role === 'ADMIN') {
    const staff = await getStaffByUserId(userId)

    return {
      ...user,
      staff: staff,
    }
  }
  return null
}
