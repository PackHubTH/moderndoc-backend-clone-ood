import { GetUserByEmail } from 'repository/UserRepository/types'

export const getIsUserFinishedRegister = (user: GetUserByEmail) => {
  if (user.role === 'STUDENT') {
    return user.student !== null
  }
  if (user.role === 'TEACHER') {
    return user.teacher !== null
  }
  if (user.role === 'STAFF') {
    return user.staff !== null
  }
  return false
}
