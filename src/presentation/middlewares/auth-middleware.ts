import { HttpRequest, HttpResponse } from './auth-middleware-protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { Middleware } from '../protocols/middleware'
import { LoadAccountByToken } from '@/domain/usecases'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
