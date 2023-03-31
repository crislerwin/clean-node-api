import { describe, expect, test, vi } from 'vitest'
import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

describe('AddSurveyController', () => {
  test('Should call Validation with correct values', async () => {
    const validationStub = makeValidation()
    const sut = new AddSurveyController(validationStub)
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
