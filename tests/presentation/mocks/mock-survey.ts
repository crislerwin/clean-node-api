import { SaveSurveyResult } from '@/domain/usecases/survey-result'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'
import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params!: SaveSurveyResult.Params
  result = mockSurveyResultModel()

  async save(params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.params = params
    return this.result
  }
}
export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId!: string
  accountId!: string
  result = mockSurveyResultModel()

  async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  id!: string
  result = [faker.word.sample(), faker.word.sample()]

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return this.result
  }
}
