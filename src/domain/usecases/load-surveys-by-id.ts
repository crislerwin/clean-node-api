import { SurveyModel } from '../models/survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyModel>
}
