import { beforeAll, describe, expect, test, vi } from 'vitest'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { LoadSurveysRepositorySpy } from '../mocks'
import { DbLoadSurveys } from '@/data/usecases'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}
const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy,
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.string.uuid()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(faker.string.uuid())
    expect(surveys).toEqual(loadSurveysRepositorySpy.result)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    vi.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load(faker.string.uuid())
    await expect(promise).rejects.toThrow()
  })
})
