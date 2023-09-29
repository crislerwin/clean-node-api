import { LoadSurveysController } from '@/presentation/controllers'
import { faker } from '@faker-js/faker'
import { describe, expect, test, vi } from 'vitest'
import { LoadSurveysSpy } from '../mocks'
import { ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.string.uuid(),
})

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    loadSurveysSpy,
    sut,
  }
}
describe('LoadSurveyResult Controller', () => {
  test('Should Call CheckSurveyById with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.accountId).toBe(request.accountId)
  })
  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result))
  })
  test('Should return 200 on sucess', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    vi.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
