import { beforeEach, describe, expect, test, vi } from 'vitest'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  forbidden,
  InvalidParamError,
  LoadSurveyById,
  serverError,
} from './save-survey-result-protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResult, mockLoadSurveyByIdRepository } from '@/domain/test'

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'any_id' },
  body: { answer: 'any_answer' },
  accountId: 'any_account_id',
})

type Sutypes = {
  sut: SaveSurveyResultController
  loadSurveysStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): Sutypes => {
  const loadSurveysStub = mockLoadSurveyByIdRepository()
  const saveSurveyResultStub = mockSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveysStub, saveSurveyResultStub)

  return {
    sut,
    saveSurveyResultStub,
    loadSurveysStub,
  }
}

describe('SaveSurveyResultController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadByIdSpy = vi.spyOn(loadSurveysStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return  403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'loadById').mockReturnValueOnce(
      new Promise((resolve) => {
        // @ts-expect-error
        resolve(null)
      }),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return  500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'loadById').mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        reject(serverError(new Error()))
      }),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return  403 if an invalid answer is provided', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'loadById')
    const httpResponse = await sut.handle({
      params: { surveyId: 'any_id' },
      body: {
        answer: 'wrong_answer',
      },
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = vi.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer',
    })
  })
})
