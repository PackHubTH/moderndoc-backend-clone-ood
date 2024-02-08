import { Staff, StaffType, User } from '@prisma/client'
import { RegisterStaffSchema } from 'controllers/UserController/types'
import * as StaffRepository from 'repository/StaffRepository'
import { addUser, getUserByEmail } from 'repository/UserRepository'

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
