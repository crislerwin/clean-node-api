import { SurveyModel } from '../models/survey'
import { LoadSurveys } from '../usecases/survey/load-surveys'

export const mockSurveyModel = (): SurveyModel => ({
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

export const mockSurveyModels = (): SurveyModel[] => [mockSurveyModel()]

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => {
        resolve(mockSurveyModels())
      })
    }
  }

  return new LoadSurveysStub()
}
