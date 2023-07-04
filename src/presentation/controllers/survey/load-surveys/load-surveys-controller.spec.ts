import { beforeEach, describe, expect, test, vi } from 'vitest'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
]

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurveys())
      })
    }
  }

  return new LoadSurveysStub()
}

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
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
    expect(httpRespose).toEqual(ok(makeFakeSurveys()))
  })
  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([])
      }),
    )
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
