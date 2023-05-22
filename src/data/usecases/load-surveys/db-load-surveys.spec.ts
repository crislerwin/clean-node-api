import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { SurveyModel } from '@/domain/models/survey'
import { describe, expect, test, vi } from 'vitest'
import { DbLoadSurveys } from './db-load-surveys'

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
]

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        return await new Promise((resolve) => {
          resolve(makeFakeSurveys())
        })
      }
    }
    const loadSurveysRepository = new LoadSurveysRepositoryStub()
    const loadSpy = vi.spyOn(loadSurveysRepository, 'loadAll')
    const sut = new DbLoadSurveys(loadSurveysRepository)
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})
