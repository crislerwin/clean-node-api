import { badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AddSurvey,
} from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation, private readonly addSurvey: AddSurvey) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse | null> {
    try {
      const { question, answers } = httpRequest.body

      await this.addSurvey.add({
        question,
        answers,
      })

      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      return await new Promise((resolve) => {
        resolve(null)
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
