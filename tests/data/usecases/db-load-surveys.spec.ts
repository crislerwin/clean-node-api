import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-survey-protocols'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { mockLoadSurveysRepository } from '@/tests/data/mocks'
import { mockSurveyModels, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = mockLoadSurveysRepository()
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
    expect(surveys).toEqual(mockSurveyModels())
  })
  test('Should  throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepository, sut } = makeSut()
    vi.spyOn(loadSurveysRepository, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})