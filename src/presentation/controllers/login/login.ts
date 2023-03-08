import { MissingPararmError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise((resolve) => {
      resolve(badRequest(new MissingPararmError('email')))
    })
  }
}
