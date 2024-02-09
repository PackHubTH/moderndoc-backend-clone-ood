import { Teacher, User } from '@prisma/client'
import { RegisterStaffSchema } from 'controllers/UserController/types'
import * as TeacherRepository from 'repository/TeacherRepository'
import { addUser, getUserByEmail } from 'repository/UserRepository'

export const addTeacher = async (
  params: RegisterStaffSchema
): Promise<Teacher> => {
  let user = (await getUserByEmail(params.emails[0])) as User | null

  if (!user)
    user = await addUser({
      emails: params.emails,
      nameEn: params.nameEn,
      nameTh: params.nameTh,
      phone: params.phone,
      profileImg: params.profileImg,
      role: params.role,
    })

  const teacher = await TeacherRepository.addTeacher({
    userId: user.id,
    staffNumber: params.staffNumber,
    departmentIds: params.departmentIds,
  })

  return teacher
}
