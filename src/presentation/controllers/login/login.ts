import { MissingPararmError } from '@/presentation/errors'
import { badRequest, ok } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingPararmError('email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(new MissingPararmError('password'))
    }
    return ok({})
  }
}
