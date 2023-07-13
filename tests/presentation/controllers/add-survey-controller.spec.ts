import { describe, expect, test, vi } from 'vitest'
import {
  badRequest,
  noContent,
  serverError,
  AddSurvey,
  HttpRequest,
  Validation,
} from '@/presentation/controllers/survey/add-survey/add-survey-controller-protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  },
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(_input: any): Promise<void> {
      await Promise.resolve(null)
    }
  }
  return new AddSurveyStub()
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub,
  }
}

describe('AddSurveyController', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if Validation fais', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = vi.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut, addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add')
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
