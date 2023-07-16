import { SurveyResultModel } from '@/domain/models/survey'

export type AddSurveyParams = Omit<SurveyResultModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
