import { SaveSurveyResultRepository } from '../protocols/db/survey/save-survey-result-repository'
import { LoadSurveyResultRepository } from '../protocols/db/survey/load-survey-result-repository'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'

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

  async loadBySurveyId(
    surveyId: string,
    accountId: string,
  ): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}
