import { Role, User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export type JWTDecoded = {
  id: string
  role: Role
  email: string
}

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

export const decodeToken = (token: string): JWTDecoded => {
  const decoded = jwt.decode(token)

  return decoded as JWTDecoded
}
