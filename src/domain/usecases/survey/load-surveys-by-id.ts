import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyResultModel>
}
