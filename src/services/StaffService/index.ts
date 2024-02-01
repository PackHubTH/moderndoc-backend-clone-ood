import { Staff, StaffType } from '@prisma/client'
import { RegisterStaffSchema } from 'controllers/UserController/types'
import * as StaffRepository from 'repository/StaffRepository'
import { addUser } from 'repository/UserRepository'

export const addStaff = async (
  params: RegisterStaffSchema
): Promise<Staff> => {
  const newUser = await addUser({
    emails: params.emails,
    nameEn: params.nameEn,
    nameTh: params.nameTh,
    phone: params.phone,
    profileImg: params.profileImg,
    role: params.role,
  })

  const staff = await StaffRepository.addStaff({
    userId: newUser.id,
    staffNumber: params.staffNumber,
    type: params.role === 'ADMIN' ? StaffType.ADMIN : StaffType.STAFF,
    departmentIds: params.departmentIds,
  })

  return staff
}
