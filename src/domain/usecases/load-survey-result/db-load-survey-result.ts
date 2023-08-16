import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '../survey/load-survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
  }
}
