import { SurveyResultModel } from '@/domain/models/survey'

export interface LoadSurveys {
  load: () => Promise<SurveyResultModel[]>
}
