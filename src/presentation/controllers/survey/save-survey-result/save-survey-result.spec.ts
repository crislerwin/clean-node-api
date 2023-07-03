import { describe, expect, test, vi } from 'vitest'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  SurveyModel,
  forbidden,
  InvalidParamError,
  LoadSurveyById,
  serverError,
} from './save-survey-result-protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultParams, SurveyResultModel } from '@/domain/models/survey-result'

const makeFakeResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
  id: 'any_id',
})

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'any_id' },
  body: { answer: 'any_answer' },
  accountId: 'any_account_id',
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurvey())
      })
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSurveyResult = (): SaveSurveyResult => {
  class SurveyResultStub implements SaveSurveyResult {
    async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeResultModel())
      })
    }
  }
  return new SurveyResultStub()
}

type Sutypes = {
  sut: SaveSurveyResultController
  loadSurveysStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): Sutypes => {
  const loadSurveysStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveysStub, saveSurveyResultStub)

  return {
    sut,
    saveSurveyResultStub,
    loadSurveysStub,
  }
}

describe('SaveSurveyResultController', () => {
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
