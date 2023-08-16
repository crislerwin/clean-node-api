import { describe, expect, test, vi } from 'vitest'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from '@/domain/usecases/load-survey-result/db-load-survey-result'
import { mockLoadSurveyResultRepository } from '../mocks'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()

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
