import { AddAccount } from '@/domain/usecases/add-account'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { Validation } from './signup-protocols'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ email, password, name })
      return ok(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
