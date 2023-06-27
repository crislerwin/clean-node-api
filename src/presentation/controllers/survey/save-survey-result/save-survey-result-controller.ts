import { forbidden, serverError } from '../add-survey/add-survey-controller-protocols'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  InvalidParamError,
  ok,
  LoadSurveyById,
} from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      return ok(survey)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
