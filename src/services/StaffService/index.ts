import { Staff, StaffType, User } from '@prisma/client'
import {
  RegisterStaffSchema,
  UpdateUserParams,
} from 'controllers/UserController/types'
import * as StaffRepository from 'repository/StaffRepository'
import {
  addUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from 'repository/UserRepository'

export const addStaff = async (params: RegisterStaffSchema): Promise<Staff> => {
  let user = (await getUserByEmail(params.emails[0])) as User | null

  if (!user) {
    user = await addUser({
      emails: params.emails,
      nameEn: params.nameEn,
      nameTh: params.nameTh,
      phone: params.phone,
      profileImg: params.profileImg,
      role: params.role,
    })
  }

  const staff = await StaffRepository.addStaff({
    userId: user.id,
    staffNumber: params.staffNumber,
    type: params.role === 'ADMIN' ? StaffType.ADMIN : StaffType.STAFF,
    departmentIds: params.departmentIds,
  })

  return staff
}

export const updateStaff = async (params: UpdateUserParams) => {
  const user = await getUserById(params.user.id)
  const staff = await StaffRepository.getStaffByUserId(user.id)
  if (!user || !staff || !params.staff) throw new Error('User not found')

  const emails = params.user.emails
  emails[0] = user.emails[0]

  const updatedUser: User = {
    ...user,
    role: params.role,
    emails,
  }

  await updateUser(updatedUser)

  await StaffRepository.updateStaff(params.staff)

  const isDepartmentChanged =
    staff.staffDepartments[0].id !== params.staff.staffDepartments[0].id

  if (isDepartmentChanged) {
    await StaffRepository.deleteAllStaffDepartment(staff.id)
    await StaffRepository.addStaffDepartment(staff.id, [
      params.staff.staffDepartments[0].id,
    ])
  }
}
