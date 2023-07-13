import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { noChache } from '@/main/middlewares/no-cache'

export default (app: Express): void => {
  app.use('/api-docs', noChache, serve, setup(swaggerConfig))
}
