import { beforeEach, describe, expect, test, vi } from 'vitest'
import { LoadSurveys } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveys, mockSurveyModels, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub,
  }
}

describe('LoadSurveys Controller', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = vi.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 200 on successs', async () => {
    const { sut } = makeSut()
    const httpRespose = await sut.handle({})
    expect(httpRespose).toEqual(ok(mockSurveyModels()))
  })
  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpRespose = await sut.handle({})
    expect(httpRespose).toEqual(noContent())
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
