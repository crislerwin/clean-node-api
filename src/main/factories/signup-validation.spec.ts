import { makeSignUpValidation } from './signup-validation'
import { describe, test, expect, vi } from 'vitest'
import { ValidateComposite } from '@/presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation'
import { Validation } from '@/presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compare-fields-validation'
vi.mock('@/presentation/helpers/validators/validation-composite')

describe('SignUp Validation', () => {
  test('Should call Validation Composite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidateComposite).toHaveBeenCalledWith(validations)
  })
})
