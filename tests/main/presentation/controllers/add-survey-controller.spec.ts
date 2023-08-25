import { describe, expect, test, vi } from 'vitest'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { AddSurveySpy, ValidationSpy } from '../mocks'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const mockRequest = (): AddSurveyController.Request => ({
  question: faker.word.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.words(),
    },
  ],
})

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy,
  }
}

describe('AddSurveyController', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest)
  })
  test('Should return 400 if Validation fais', async () => {
    const { sut, validationSpy: validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addSurveySpy.params).toEqual({ ...request, date: new Date() })
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy: addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut, addSurveySpy: addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add')
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
