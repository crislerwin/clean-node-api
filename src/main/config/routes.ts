import { Express, Router } from 'express'
import { loginRoute } from '../routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  loginRoute(router)
}
