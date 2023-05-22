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
interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurveys())
      })
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepository)
  return {
    sut,
    loadSurveysRepository,
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()
    const loadSpy = vi.spyOn(loadSurveysRepository, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})
