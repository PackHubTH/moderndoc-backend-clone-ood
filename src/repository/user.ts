import { User } from 'types/user'

export const getUserById = async (id: number): Promise<User> => {
  return {
    id,
    name: 'John Doe',
  }
}
