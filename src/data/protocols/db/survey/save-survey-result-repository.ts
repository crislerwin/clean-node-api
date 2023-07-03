import { SaveSurveyResultParams, SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
