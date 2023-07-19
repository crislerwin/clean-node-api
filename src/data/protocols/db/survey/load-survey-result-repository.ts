import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<SaveSurveyResult.Result>
}

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel
}
