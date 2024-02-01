import { Teacher } from '@prisma/client'
import { RegisterStaffSchema } from 'controllers/UserController/types'
import * as TeacherRepository from 'repository/TeacherRepository'
import { addUser } from 'repository/UserRepository'

export const addTeacher = async (
  params: RegisterStaffSchema
): Promise<Teacher> => {
  const newUser = await addUser({
    emails: params.emails,
    nameEn: params.nameEn,
    nameTh: params.nameTh,
    phone: params.phone,
    profileImg: params.profileImg,
    role: params.role,
  })

  const teacher = await TeacherRepository.addTeacher({
    userId: newUser.id,
    staffNumber: params.staffNumber,
    departmentIds: params.departmentIds,
  })

  return teacher
}
