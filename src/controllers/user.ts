import { Request, Response } from 'express'
import { getRandomUser } from 'services/user'

export const getSomeUser = async (req: Request, res: Response) => {
  const someUser = await getRandomUser()

  res.send(someUser)
}
