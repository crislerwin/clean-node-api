import { MissingPararmError } from '@/presentation/errors'
import { describe, expect, test } from 'vitest'
import { Validation } from './validation'
import { ValidateComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingPararmError('field')
      }
    }

    const validationStub = new ValidationStub()
    const sut = new ValidateComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingPararmError('field'))
  })
})
