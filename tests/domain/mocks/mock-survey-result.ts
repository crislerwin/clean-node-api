import { SaveSurveyResultParams, SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockSurveyResult = (): SaveSurveyResult => {
  class SurveyResultStub implements SaveSurveyResult {
    async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SurveyResultStub()
}

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
  count: 0,
  percent: 0,
})

export const mockSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSaveSurveyResultParams(), {
    id: 'any_id',
  })
