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
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map((a) => a.answer)
        if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
        return ok(survey)
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
