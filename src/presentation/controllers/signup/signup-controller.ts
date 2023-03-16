import { AddAccount } from '@/domain/usecases/add-account'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validation } from './signup-controller-protocols'

export class SignupController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const account = await this.addAccount.add({ email, password, name })
      return ok(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
