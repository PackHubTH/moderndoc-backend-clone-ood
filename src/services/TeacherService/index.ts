import { Teacher, User } from '@prisma/client'
import {
  RegisterStaffSchema,
  UpdateUserParams,
} from 'controllers/UserController/types'
import * as TeacherRepository from 'repository/TeacherRepository'
import * as UserRepository from 'repository/UserRepository'
import { addUser, getUserByEmail, getUserById } from 'repository/UserRepository'

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

export const updateTeacher = async (params: UpdateUserParams) => {
  const user = await getUserById(params.user.id)
  const teacher = await TeacherRepository.getTeacherByUserId(params.user.id)
  if (!user || !teacher || !params.teacher) throw new Error('User not found')

  const emails = params.user.emails
  emails[0] = user.emails[0]

  const updatedUser: User = {
    ...params.user,
    role: 'TEACHER',
    emails,
  }

  await UserRepository.updateUser(updatedUser)

  const result = await TeacherRepository.updateTeacher(params.teacher)

  console.log(
    teacher.teacherDepartments[0].departmentId,
    params.teacher
  )

  const isDepartmentChanged =
    teacher.teacherDepartments[0].departmentId !==
    params.teacher.teacherDepartments[0].departmentId

  console.log('🚀 ~ updateTeacher ~ isDepartmentChanged:', isDepartmentChanged)

  if (isDepartmentChanged) {
    await TeacherRepository.deleteAllTeacherDepartment(teacher.id)
    await TeacherRepository.addTeacherDepartment(teacher.id, [
      params.teacher.teacherDepartments[0].departmentId,
    ])
  }

  return result
}
