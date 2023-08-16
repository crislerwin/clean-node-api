import { SaveSurveyResultRepository } from '../protocols/db/survey/save-survey-result-repository'
import { LoadSurveyResultRepository } from '../protocols/db/survey/load-survey-result-repository'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'
import { SurveyResultModel } from '../usecases/survey/save-survey-result/db-save-survey-result.protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params!: SaveSurveyResultRepository.Params

  async save(params: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId!: string
  accountId!: string
  result = mockSurveyResultModel()

  async loadBySurveyId(surveyId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    return this.result
  }
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(mockSurveyResultModel()))
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
