import { SurveyResultModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyResultModel>
}
