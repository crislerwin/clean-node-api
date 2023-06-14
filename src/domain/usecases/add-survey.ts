import { SurveyAnswerModel } from '../models/survey'

export type AddSurveyModel = Omit<SurveyAnswerModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
