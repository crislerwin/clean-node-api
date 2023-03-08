import { Authentication } from '@/domain/usecases/authentication'
import { InvalidParamError, MissingPararmError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      if (!email) {
        return badRequest(new MissingPararmError('email'))
      }
      if (!password) {
        return badRequest(new MissingPararmError('password'))
      }
      await this.authentication.auth(email, password)
      return ok({})
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
