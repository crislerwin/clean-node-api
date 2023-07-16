import { SurveyResultModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyResultModel>
}
