import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest'
import { DbSaveSurveyResult } from './db-save-survey-result'
import {
  SaveSurveyResultRepository,
  SaveSurveyResultModel,
  SurveyResultModel,
} from './db-save-survey-result.protocols'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date(),
})

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), {
    id: 'any_id',
  })

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurveyResult())
      })
    }
  }
  return new SaveSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
    const surveyData = makeFakeSurveyResultData()
    await sut.save(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if DbSaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(
      async (): Promise<SurveyResultModel> => {
        return await new Promise((resolve, reject) => {
          reject(new Error())
        })
      },
    )

    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = await sut.save(makeFakeSurveyResultData())
    expect(surveyResultData).toEqual(makeFakeSurveyResult())
  })
})
