import { Authentication } from '@/domain/usecases/authentication'
import { MissingPararmError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingPararmError(field))
      }
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorized()
      return ok({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
