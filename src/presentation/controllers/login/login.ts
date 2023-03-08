import { InvalidParamError, MissingPararmError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      if (!httpRequest.body.email) {
        return badRequest(new MissingPararmError('email'))
      }
      if (!httpRequest.body.password) {
        return badRequest(new MissingPararmError('password'))
      }
      return ok({})
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
