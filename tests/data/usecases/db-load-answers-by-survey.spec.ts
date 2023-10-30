import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '../mocks'
import { faker } from '@faker-js/faker'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
  }
}
let surveyId: string
describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.string.uuid()
  })
  test('Should call LoadAnswersBySurveyRepository', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  test('Should return asnwers on success', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()

    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1],
    ])
  })
  test('Should return empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })
  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    vi.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
