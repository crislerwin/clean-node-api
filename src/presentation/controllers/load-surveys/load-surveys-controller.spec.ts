import { describe, expect, test, vi } from 'vitest'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'

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

describe('LoadSurveys Controller', () => {
  test('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return await new Promise((resolve) => {
          resolve(makeFakeSurveys())
        })
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const loadSpy = vi.spyOn(loadSurveysStub, 'load')
    const sut = new LoadSurveysController(loadSurveysStub)
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
