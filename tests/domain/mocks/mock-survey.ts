import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SurveyResultModel } from '../models/survey-result'

export const mockSurveyModel = (): SurveyResultModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 0,
      isCurrentAccountAnswer: false,
      percent: 0,
    },
  ],
  date: new Date(),
})

export const mockSurveyModels = (): SurveyResultModel[] => [mockSurveyModel()]

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyResultModel[]> {
      return await Promise.resolve(mockSurveyModels())
    }
  }

  return new LoadSurveysStub()
}

export class LoadSurveysSpy implements LoadSurveys {
  accountId!: string
  result = mockSurveyModels()

  async load(accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return this.result
  }
}
