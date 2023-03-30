import { AddAccount } from '@/domain/usecases/add-account'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Authentication } from '../login/login-controller-protocols'
import { Validation } from './signup-controller-protocols'

export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const account = await this.addAccount.add({ email, password, name })
      if (!account) return forbidden(new EmailInUseError())
      const accessToken = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
