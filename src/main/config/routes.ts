import { Express, Router } from 'express'
import { signUp } from '../routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  signUp(router)
}
