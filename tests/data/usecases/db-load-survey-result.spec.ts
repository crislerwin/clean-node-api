import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { DbLoadSurveyResult } from '@/data/usecases'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
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

  test('Should call  LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    vi.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })
  test('Should call LoadSurveyByIdRepository if LoadSurveyResult returns null', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    // @ts-expect-error
    loadSurveyResultRepositorySpy.result = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    const { result } = loadSurveyResultRepositorySpy
    expect(surveyResult).toEqual({
      surveyId: result.surveyId,
      question: result.question,
      date: result.date,
      answers: result.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false,
      })),
    })
  })
  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
