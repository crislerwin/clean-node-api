import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest'
import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import {
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '@/data/usecases/survey/save-survey-result/db-save-survey-result.protocols'
import { mockSaveSurveyResultRepository } from '@/tests/data/mocks'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
  }
}
describe('DbSaveSurveyResult', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  test('should call DbSaveSurveyResult with correct values', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    const addSpy = vi.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if DbSaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(
      async (): Promise<SurveyResultModel> => {
        return await Promise.reject(new Error())
      },
    )

    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResultData).toEqual(mockSurveyResultModel())
  })
})
