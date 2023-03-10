import { MissingPararmError } from '@/presentation/errors'
import { describe, expect, test } from 'vitest'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required fields validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingPararmError('field'))
  })
})
