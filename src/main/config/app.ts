import express, { Express } from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'
import setupGrapql from '../graphql/apollo/apollo-server'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  await setupGrapql(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  return app
}
