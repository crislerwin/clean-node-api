import { SurveyResultModel } from '@/domain/models/survey-result'
import { AddSurvey } from '../usecases/add-survey'
import { SaveSurveyResult } from '../usecases'
import { faker } from '@faker-js/faker'

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
  date: faker.date.recent(),
  question: faker.word.words(),
  surveyId: faker.string.uuid(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.words(),
      count: 0,
      isCurrentAccountAnswer: false,
      percent: 0,
    },
    {
      image: faker.image.url(),
      answer: faker.word.words(),
      count: 0,
      isCurrentAccountAnswer: false,
      percent: 0,
    },
  ],
})
