import { SurveyResultModel } from '@/domain/models/survey-result'
import { AddSurvey } from '../usecases/add-survey'
import { SaveSurveyResult } from '../usecases'

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 1,
      isCurrentAccountAnswer: false,
      percent: 100,
    },
  ],
  date: new Date(),
  question: 'any_question',
  surveyId: 'any_id',
})
