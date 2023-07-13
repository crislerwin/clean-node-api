import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest'
import { DbAddSurvey } from '@/data/usecases/survey/db-add-survey/db-add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { mockAddSurveyRepository } from '@/tests/data/mocks'
import { mockAddSurveyParams } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub,
  }
}
describe('DbAddSurvey', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  test('should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(mockAddSurveyParams())
    expect(addSpy).toHaveBeenCalledWith(mockAddSurveyParams())
  })
  test('Should throw if Hasher throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    vi.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(
      async () => await Promise.reject(new Error()),
    )

    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
