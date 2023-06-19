import { SaveSurveyResultModel, SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
