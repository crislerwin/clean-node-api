import { MissingPararmError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name === undefined) {
      return badRequest(new MissingPararmError('name'))
    }
    if (httpRequest.body.email === undefined) {
      return badRequest(new MissingPararmError('email'))
    }

    return {
      statusCode: 200,
      body: 'ok',
    }
  }
}
