import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'
import { faker } from '@faker-js/faker'
import { DbLoadSurveyResult } from '@/data/usecases'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepository = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyResultRepositorySpy,
  }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    surveyId = faker.string.uuid()

    accountId = faker.string.uuid()
  })

  test('Should call  LoadSurveyResultRepository ', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadSurveyByIdSpy = vi.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith(surveyId, accountId)
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    vi.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })
  test('Should return on DbLoadSurveyResult return surveyResult on sucess', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
