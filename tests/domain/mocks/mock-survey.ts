import { SurveyResultModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockSurveyModel = (): SurveyResultModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
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
