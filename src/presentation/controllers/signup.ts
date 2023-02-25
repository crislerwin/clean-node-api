import { MissingPararmError } from '../errors/missing-param-error'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (httpRequest.body.name === undefined) {
      return {
        statusCode: 400,
        body: new MissingPararmError('name'),
      }
    }
    if (httpRequest.body.email === undefined) {
      return {
        statusCode: 400,
        body: new MissingPararmError('email'),
      }
    }

    return {
      statusCode: 200,
      body: 'ok',
    }
  }
}
