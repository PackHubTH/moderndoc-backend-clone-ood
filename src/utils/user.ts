import { User } from 'types/user'

export const getUserUniqueName = (user: User) => {
  return `${user.id}-${user.name}`
}
