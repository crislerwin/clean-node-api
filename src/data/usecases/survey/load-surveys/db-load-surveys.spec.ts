import { LoadSurveysRepository, SurveyModel } from './db-load-survey-protocols'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { DbLoadSurveys } from './db-load-surveys'
import { throwError } from '@/domain/test'

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
type SutTypes = {
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
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()
    const loadSpy = vi.spyOn(loadSurveysRepository, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })
  test('Should  throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepository, sut } = makeSut()
    vi.spyOn(loadSurveysRepository, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
