import { SurveyResultModel } from '@/domain/models/survey-result'
import { describe, expect, test, vi } from 'vitest'

import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from '@/domain/usecases/load-survey-result/db-load-survey-result'
import { mockSurveyResultModel } from '@/tests/domain/mocks/mock-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(mockSurveyResultModel()))
    }
  }
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call  LoadSurveyResultRepository ', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = vi.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toHaveBeenLastCalledWith('any_survey_id')
  })
})
