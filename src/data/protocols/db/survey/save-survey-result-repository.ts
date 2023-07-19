import { SaveSurveyResult } from '@/domain/usecases/survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultRepository.Params) => Promise<void>
}

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params
}
