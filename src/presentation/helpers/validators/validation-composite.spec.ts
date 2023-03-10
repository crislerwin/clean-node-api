import { MissingPararmError } from '@/presentation/errors'
import { describe, expect, test, vi } from 'vitest'
import { Validation } from './validation'
import { ValidateComposite } from './validation-composite'

interface SutTypes {
  sut: ValidateComposite
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as Error
    }
  }

  const validationStub = new ValidationStub()

  const sut = new ValidateComposite([validationStub])

  return {
    sut,
    validationStub,
  }
}

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingPararmError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingPararmError('field'))
  })
})
