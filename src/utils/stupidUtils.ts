import prisma from '@prisma'
export const createCPEFaculty = async () => {
  const faculty = 'วิศวกรรมศาสตร์'
  const addedFaculty = await prisma.faculty.create({
    data: {
      name: faculty,
    },
  })

  const department = 'วิศวกรรมคอมพิวเตอร์'
  const addedDepartment = await prisma.department.create({
    data: {
      name: department,
      faculty: {
        connect: {
          id: addedFaculty.id,
        },
      },
      type: 'DEPARTMENT',
    },
  })

  const courses = ['ปริญญาตรี ภาควิชาปกติ', 'ปริญญาโท ภาควิชาปกติ']
  for (const course of courses) {
    await prisma.course.create({
      data: {
        name: course,
        department: {
          connect: {
            id: addedDepartment.id,
          },
        },
      },
    })
  }
}
