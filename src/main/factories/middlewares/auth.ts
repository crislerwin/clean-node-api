import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from './auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
