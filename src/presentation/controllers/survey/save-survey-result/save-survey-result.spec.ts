import { describe, expect, test, vi } from 'vitest'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest } from './save-survey-result-protocols'
import { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import { SurveyModel } from '../load-surveys/load-surveys-controller-protocols'
import { forbidden } from '../add-survey/add-survey-controller-protocols'
import { InvalidParamError, ok } from '../../login/login/login-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'any_id' },
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

type Sutypes = {
  sut: SaveSurveyResultController
  loadSurveysStub: LoadSurveyById
}
const makeSut = (): Sutypes => {
  const loadSurveysStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveysStub)
  return {
    sut,
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

  test('Should return a valid survey on success', async () => {
    const { sut, loadSurveysStub } = makeSut()
    vi.spyOn(loadSurveysStub, 'loadById')
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurvey()))
  })
})
