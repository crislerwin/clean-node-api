import { makeSignUpValidation } from './signup-validation'
import { describe, test, expect, vi } from 'vitest'
import { ValidateComposite } from '@/presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation'
import { Validation } from '@/presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '@/presentation/helpers/validators/email-validation'
import { EmailValidator } from '@/presentation/protocols/email-validator'
vi.mock('@/presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_mail: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validation', () => {
  test('Should call Validation Composite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidateComposite).toHaveBeenCalledWith(validations)
  })
})
