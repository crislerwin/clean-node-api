import { Request, Response, NextFunction } from 'express'

export const noChache = (_: Request, res: Response, next: NextFunction): void => {
  res.set('cache-control', '*')
  res.set('pragma', 'no-cache')
  res.set('expires', '0')
  res.set('surrogate-control', 'no-store')
  next()
}
