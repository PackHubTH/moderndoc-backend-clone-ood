import { Student, User } from '@prisma/client'
import { RegisterStudentParams } from 'controllers/UserController/types'
import * as StudentRepository from 'repository/StudentRepository'
import { addUser, getUserByEmail } from 'repository/UserRepository'

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
