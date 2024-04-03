import { Role } from '@prisma/client'
import {
  ApproveDepartmentMemberRequest,
  GetDepartmentMembersRequest,
} from 'controllers/DepartmentController/types'
import * as DepartmentRepo from 'repository/DepartmentRepository'
import { getUserById } from 'services/UserService'

export const getDepartmentMembers = async (
  params: GetDepartmentMembersRequest
) => {
  const user = await getUserById(params.userId)

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId

  if (!departmentId) throw new Error('Staff no department')

  const users = await DepartmentRepo.getDepartmentMembers(
    departmentId,
    params.isApproved,
    params.page
  )

  return users
}

export const approveDepartmentMember = async (
  params: ApproveDepartmentMemberRequest
) => {
  const user = await getUserById(params.userId)

  const departmentId =
    user?.staff?.staffDepartments[0]?.departmentId ||
    user?.teacher?.teacherDepartments[0]?.departmentId

  if (!departmentId) throw new Error('Staff no department')

  const member = await getUserById(params.memberUserId)
  if (!member) throw new Error('Member not found')

  switch (member.role) {
    case Role.STUDENT:
      return await DepartmentRepo.approveStudentMember(member.student!.id)

    case Role.STAFF:
      return await DepartmentRepo.approveStaffMember(
        member.staff!.id,
        departmentId
      )
    case Role.TEACHER:
      return await DepartmentRepo.approveTeacherMember(
        member.staff!.id,
        departmentId
      )
    default:
      throw new Error('Invalid role')
  }
}
