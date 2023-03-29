import { InvalidParamError } from '@/presentation/errors'
import { describe, expect, test } from 'vitest'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(error).toBeUndefined()
  })
})
