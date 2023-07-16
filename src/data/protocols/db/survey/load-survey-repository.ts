import { SurveyResultModel } from '@/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyResultModel[]>
}
