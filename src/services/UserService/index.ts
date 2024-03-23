import prisma from '@prisma'
import { getCourseById } from 'repository/CourseRepository'
import { getStaffByUserId } from 'repository/StaffRepository'
import { getStudentByUserId } from 'repository/StudentRepository'
import { getTeacherByUserId } from 'repository/TeacherRepository'

import { GetUserById } from './types'

export const getUserById = async (
  userId: string
): Promise<GetUserById | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (user?.role === 'STUDENT') {
    const student = await getStudentByUserId(userId)

    return {
      ...user,
      student: student!,
    }
  } else if (user?.role === 'TEACHER') {
    const teacher = await getTeacherByUserId(userId)

    return {
      ...user,
      teacher: teacher!,
    }
  } else if (user?.role === 'STAFF' || user?.role === 'ADMIN') {
    const staff = await getStaffByUserId(userId)

    return {
      ...user,
      staff: staff!,
    }
  }
  return null
}

export const getUserDepartmentId = async (
  userId: string,
  staffOnly: boolean = false
): Promise<string> => {
  const user = await getUserById(userId)

  let departmentId: string | null = null

  if (user && user?.role === 'STUDENT' && !staffOnly) {
    const department = await getCourseById(user.student!.courseId!)

    departmentId = department!.departmentId
  } else {
    departmentId =
      user?.staff?.staffDepartments?.[0]?.departmentId ??
      user?.teacher?.teacherDepartments[0]?.departmentId ??
      null
  }

  if (!departmentId) throw new Error('Staff no department')

  return departmentId
}
