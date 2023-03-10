import { MissingPararmError } from '@/presentation/errors'
import { describe, expect, test, vi } from 'vitest'
import { Validation } from './validation'
import { ValidateComposite } from './validation-composite'

interface SutTypes {
  sut: ValidateComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as Error
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidateComposite(validationStubs)
  return {
    sut,
    validationStubs,
  }
}

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingPararmError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingPararmError('field'))
  })
  test('Should return the first error more than one validation fails ', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingPararmError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
})
