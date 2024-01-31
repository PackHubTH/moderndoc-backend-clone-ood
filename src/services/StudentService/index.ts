import { Student } from '@prisma/client'
import { RegisterStudentParams } from 'controllers/UserController/types'
import * as StudentRepository from 'repository/StudentRepository'
import { addUser } from 'repository/UserRepository'

export const addStudent = async (
  params: RegisterStudentParams
): Promise<Student> => {
  const newUser = await addUser({
    emails: params.emails,
    nameEn: params.nameEn,
    nameTh: params.nameTh,
    phone: params.phone,
    profileImg: params.profileImg,
    role: 'STUDENT',
  })

  const student = await StudentRepository.addStudent({
    userId: newUser.id,
    studentNumber: params.studentNumber,
    courseId: params.courseId,
  })

  return student
}
