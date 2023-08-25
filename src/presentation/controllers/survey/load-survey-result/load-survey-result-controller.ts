import { CheckSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { Controller, HttpResponse } from './load-survey-controller.protocols'
import { forbidden } from '../add-survey/add-survey-controller-protocols'
import { InvalidParamError } from '../save-survey-result/save-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: CheckSurveyById) {}
  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    const { surveyId } = request
    const surveyExists = await this.loadSurveyById.checkById(surveyId)
    if (!surveyExists) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    // @ts-expect-error
    return null
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
