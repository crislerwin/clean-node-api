import { badRequest } from './bad-request'
import { forbidden } from './forbidden'
import { serverError } from './server-error'
import { unauthorized } from './unauthorized'
import { notFound } from './not-found'
import { apiKeyAuth } from '../schemas/api-key-auth-schema'

export default {
  badRequest,
  forbidden,
  serverError,
  unauthorized,
  notFound,
  securitySchemes: {
    apiKeyAuth,
  },
}
