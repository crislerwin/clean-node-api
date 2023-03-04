import { Express } from 'express'
import { contentType, cors, bodyParser } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
