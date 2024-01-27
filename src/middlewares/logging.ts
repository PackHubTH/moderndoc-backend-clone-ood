import { NextFunction, Request, Response } from 'express'

export const logTime = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    'Time: ',
    new Date().toLocaleString(),
    req.url,
    req.headers['user-agent']
  )
  next()
}
