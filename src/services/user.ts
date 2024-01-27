import { getUserById } from 'repository/user'

export const getRandomUser = async () => {
  const user = await getUserById(Math.floor(Math.random() * 10) + 1)
  return user
}
