import { badRequest } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './add-survey-controller-protocols'
export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(request: HttpRequest): Promise<HttpResponse | null> {
    const error = this.validation.validate(request.body)
    if (error) return badRequest(error)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }
}
