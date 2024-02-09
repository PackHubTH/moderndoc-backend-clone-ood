import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const generateToken = (user: User) => {
  const jwtSecret = process.env.JWT_SECRET as string
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.emails[0] },
    jwtSecret,
    {
      expiresIn: 86400,
    }
  )

  return token
}

export const verifyToken = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET as string
  const decoded = jwt.verify(token, jwtSecret)

  return decoded
}

export const decodeToken = (token: string) => {
  const decoded = jwt.decode(token)

  return decoded
}
