import { SaveSurveyResult } from '@/domain/usecases/survey-result'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { LoadSurveyResult } from '@/domain/usecases/survey/load-survey-result'
import { mockSurveyModels } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { LoadSurveys } from '../controllers/survey/load-surveys/load-surveys-controller-protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'
import { AddSurvey } from '../controllers/survey/add-survey/add-survey-controller-protocols'

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
