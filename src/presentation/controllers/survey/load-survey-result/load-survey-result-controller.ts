import { CheckSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpResponse } from './load-survey-controller.protocols'
import { forbidden, ok, serverError } from '../add-survey/add-survey-controller-protocols'
import { InvalidParamError } from '../save-survey-result/save-survey-result-protocols'
import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request
      const exists = await this.loadSurveyById.checkById(surveyId)
      if (!exists) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
