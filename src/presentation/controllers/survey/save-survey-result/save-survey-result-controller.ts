import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { forbidden, ok, serverError } from '../add-survey/add-survey-controller-protocols'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  InvalidParamError,
  LoadSurveyById,
} from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map((a) => a.answer)
        if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
        const surveyResult = await this.saveSurveyResult.save({
          surveyId,
          accountId,
          date: new Date(),
          answer,
        })
        return ok(surveyResult)
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
