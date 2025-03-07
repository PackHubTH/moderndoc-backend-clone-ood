import prisma from '@prisma'
import { ApprovalStatus, Department } from '@prisma/client'

export const getDepartmentsByFacultyId = async (
  facultyId: string
): Promise<Department[]> => {
  const departments = await prisma.department.findMany({
    where: {
      facultyId,
    },
  })

  return departments
}

export const getAllAgencyDepartments = async (): Promise<Department[]> => {
  const department = await prisma.department.findMany({
    where: {
      type: 'AGENCY',
    },
  })

  return department
}

export const getDepartmentById = async (
  id: string
): Promise<Department | null> => {
  const department = await prisma.department.findFirst({
    where: {
      id,
    },
    include: {
      faculty: true,
    },
  })

  return department
}

export const addAgencyDepartment = async (
  name: string
): Promise<Department> => {
  const department = await prisma.department.create({
    data: {
      name,
      type: 'AGENCY',
    },
  })

  return department
}

export const updateDepartment = async (departmentId: string, name: string) => {
  const department = await prisma.department.update({
    where: {
      id: departmentId,
    },
    data: {
      name,
    },
  })
  return department
}

export const getDepartmentMembers = async (
  departmentId: string,
  isApproved: boolean,
  page: number = 1
  // search: string
) => {
  const totalUserCount = await prisma.user.count({
    where: {
      OR: [
        {
          student: {
            isApproved: isApproved
              ? ApprovalStatus.APPROVED
              : ApprovalStatus.PENDING,
            course: {
              departmentId: departmentId,
            },
          },
        },
        {
          staff: {
            staffDepartments: {
              some: {
                departmentId,
                isApproved: isApproved
                  ? ApprovalStatus.APPROVED
                  : ApprovalStatus.PENDING,
              },
            },
          },
        },
        {
          teacher: {
            teacherDepartments: {
              some: {
                departmentId,
                isApproved: isApproved
                  ? ApprovalStatus.APPROVED
                  : ApprovalStatus.PENDING,
              },
            },
          },
        },
      ],
    },
  })
  const totalPages = Math.ceil(totalUserCount / 10)

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          student: {
            isApproved: isApproved
              ? ApprovalStatus.APPROVED
              : ApprovalStatus.PENDING,
            course: {
              departmentId: departmentId,
            },
          },
        },
        {
          staff: {
            staffDepartments: {
              some: {
                departmentId,
                isApproved: isApproved
                  ? ApprovalStatus.APPROVED
                  : ApprovalStatus.PENDING,
              },
            },
          },
        },
        {
          teacher: {
            teacherDepartments: {
              some: {
                departmentId,
                isApproved: isApproved
                  ? ApprovalStatus.APPROVED
                  : ApprovalStatus.PENDING,
              },
            },
          },
        },
      ],
    },
    include: {
      student: {
        select: {
          studentNumber: true,
        },
      },
      staff: {
        select: {
          staffNumber: true,
        },
      },
      teacher: {
        select: {
          staffNumber: true,
        },
      },
    },
    skip: (page - 1) * 10,
    take: 10,
  })

  return {
    data: users,
    totalPages: totalPages,
    count: totalUserCount,
  }
}

export const approveStudentMember = async (
  studentId: string,
  isApproved: boolean
) => {
  const student = await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      isApproved: isApproved
        ? ApprovalStatus.APPROVED
        : ApprovalStatus.REJECTED,
    },
  })

  return student
}
export const approveStaffMember = async (
  staffId: string,
  departmentId: string,
  isApproved: boolean
) => {
  const staffDepartment = await prisma.staffDepartment.findFirst({
    where: {
      departmentId,
      staffId: staffId,
    },
  })

  const updatedStaffDepartment = await prisma.staffDepartment.update({
    where: {
      id: staffDepartment?.id,
    },
    data: {
      isApproved: isApproved
        ? ApprovalStatus.APPROVED
        : ApprovalStatus.REJECTED,
    },
  })

  return updatedStaffDepartment
}

export const approveTeacherMember = async (
  teacherId: string,
  departmentId: string,
  isApproved: boolean
) => {
  const teacherDepartment = await prisma.teacherDepartment.findFirst({
    where: {
      departmentId,
      teacherId: teacherId,
    },
  })

  const updatedTeacherDepartment = await prisma.teacherDepartment.update({
    where: {
      id: teacherDepartment?.id,
    },
    data: {
      isApproved: isApproved
        ? ApprovalStatus.APPROVED
        : ApprovalStatus.REJECTED,
    },
  })

  return updatedTeacherDepartment
}
