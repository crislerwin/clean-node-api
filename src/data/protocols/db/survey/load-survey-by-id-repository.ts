import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyResultModel>
}
