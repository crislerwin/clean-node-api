import { faker } from '@faker-js/faker'
import { DbCheckSurveyById } from '@/data/usecases'
import { CheckSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut,
    checkSurveyByIdRepositorySpy,
  }
}

let surveyId: string
describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid()
  })
  test('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })
  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(surveyId)
    expect(exists).toBe(true)
  })
  test('Should throws if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    vi.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
