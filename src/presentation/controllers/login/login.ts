import { InvalidParamError, MissingPararmError } from '@/presentation/errors'
import { badRequest, ok } from '@/presentation/helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
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
    return ok({})
  }
}
