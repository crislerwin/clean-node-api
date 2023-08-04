import { SurveyModel } from '../models/survey'
import { faker } from '@faker-js/faker'
import { AddSurvey } from '../usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.string.uuid(),
    question: faker.lorem.word(),
    answers: [
      {
        answer: faker.lorem.word(),
      },
      {
        answer: faker.lorem.word(),
        image: faker.image.url(),
      },
    ],
    date: faker.date.recent(),
  }
}

export const mockSurveyModels = (): SurveyModel[] => [mockSurveyModel(), mockSurveyModel()]

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.lorem.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.lorem.word(),
    },
    {
      answer: faker.lorem.word(),
    },
  ],
  date: faker.date.recent(),
})
