import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (data: AddSurveyModel) => Promise<void>
}
