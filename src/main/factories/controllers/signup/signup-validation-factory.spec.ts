import { makeSignUpValidation } from './signup-validation-factory'
import { describe, test, expect, vi } from 'vitest'
import {
  ValidateComposite,
  RequiredFieldValidation,
  EmailValidation,
  CompareFieldsValidation,
  Validation,
  EmailValidator,
} from '@/validation/validators'
vi.mock('@/validation/validators/validation-composite')

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
