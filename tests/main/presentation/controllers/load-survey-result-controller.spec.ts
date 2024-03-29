import { LoadSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { describe, expect, test, vi } from 'vitest'
import { LoadSurveyResultSpy } from '../mocks'
import { CheckSurveyById } from '@/domain/usecases'

export class CheckSurveyByIdSpy implements CheckSurveyById {
  id!: string
  result = true

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy)
  return {
    sut,
    checkSurveyByIdSpy,
    loadSurveyResultSpy,
  }
}
const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
})

describe('LoadSurveyResultController', () => {
  test('Should call CheckSurveyById with corrrect value', async () => {
    const { checkSurveyByIdSpy, sut } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(checkSurveyByIdSpy.id).toBe(request.surveyId)
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { checkSurveyByIdSpy, sut } = makeSut()
    checkSurveyByIdSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Shold return 500 if CheckSurveyById throws', async () => {
    const { checkSurveyByIdSpy, sut } = makeSut()
    vi.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId)
  })
  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    vi.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.result))
  })
})
