import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest'
import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import { SurveyResultModel } from '@/data/usecases/survey/save-survey-result/db-save-survey-result.protocols'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/tests/data/mocks'
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
} from '@/tests/domain/mocks/mock-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
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
    const { saveSurveyResultRepositorySpy, sut } = makeSut()
    const addSpy = vi.spyOn(saveSurveyResultRepositorySpy, 'save')
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if DbSaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    vi.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(
      // @ts-expect-error
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
