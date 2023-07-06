import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SaveSurveyResultParams, SurveyResultModel } from '../models/survey-result'
import { mockSurveyResultModel } from './mock-survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(mockSurveyResultModel())
      })
    }
  }
  return new SaveSurveyRepositoryStub()
}
