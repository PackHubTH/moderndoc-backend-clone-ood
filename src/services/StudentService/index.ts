import { Student, User } from '@prisma/client'
import {
  RegisterStudentParams,
  UpdateUserParams,
} from 'controllers/UserController/types'
import * as StudentRepository from 'repository/StudentRepository'
import {
  addUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from 'repository/UserRepository'

export const addStudent = async (
  params: RegisterStudentParams
): Promise<Student> => {
  let user = (await getUserByEmail(params.emails[0])) as User | null

  if (!user)
    user = await addUser({
      emails: params.emails,
      nameEn: params.nameEn,
      nameTh: params.nameTh,
      phone: params.phone,
      profileImg: params.profileImg,
      role: 'STUDENT',
    })

  const student = await StudentRepository.addStudent({
    userId: user.id,
    studentNumber: params.studentNumber,
    courseId: params.courseId,
  })

  return student
}

export const updateStudent = async (params: UpdateUserParams) => {
  const user = await getUserById(params.user.id)
  const student = await StudentRepository.getStudentByUserId(params.user.id)
  if (!user || !student || !params.student) throw new Error('User not found')

  const emails = params.user.emails
  emails[0] = user.emails[0]

  const updatedUser: User = {
    ...params.user,
    role: 'STUDENT',
    emails,
  }

  await updateUser(updatedUser)

  const isCourseChanged = student.courseId !== params.student.courseId

  const updatedStudent: Student = {
    ...student,
    advisorId: params.student.advisorId,
    courseId: params.student.courseId,
    isApproved: isCourseChanged ? false : student.isApproved,
  }

  const result = await StudentRepository.updateStudent(updatedStudent)

  return result
}
