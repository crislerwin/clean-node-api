import { SaveSurveyResult } from '@/domain/usecases/survey-result'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'
import { mockSurveyModels } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export class LoadSurveysSpy implements LoadSurveys {
  accountId!: string
  result = mockSurveyModels()

  async load(accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return this.result
  }
}

export class AddSurveySpy implements AddSurvey {
  params!: AddSurvey.Params

  async add(params: AddSurvey.Params): Promise<void> {
    this.params = params
  }
}

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
  result = mockSurveyResultModel()

  async load(surveyId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
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
