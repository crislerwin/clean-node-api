import { badRequest } from './bad-request'
import { forbidden } from './forbidden'
import { serverError } from './server-error'
import { unauthorized } from './unauthorized'
import { notFound } from './not-found'
import { apiKeyAuth } from './api-key-auth'

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
