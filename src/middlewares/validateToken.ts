import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { decodeToken } from 'utils/authUtils'

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  const token = (authorization as string)?.split(' ')[1]

  if (authorization === undefined) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: null,
    })
  }

  if (req.headers.userId || req.headers.email || req.headers.role) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'You are not smart enough to hack this system.',
      error: null,
    })
  }

  try {
    const decoded = decodeToken(token)
    req.headers.userId = decoded.id
    req.headers.email = decoded.email
    req.headers.role = decoded.role

    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Unauthorized',
      error: error,
    })
  }
}
