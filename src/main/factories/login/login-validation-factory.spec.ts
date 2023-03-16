import { makeLoginValidation } from './login-validation-factory'
import { describe, test, expect, vi } from 'vitest'
import {
  ValidateComposite,
  EmailValidation,
  EmailValidator,
  Validation,
  RequiredFieldValidation,
} from '@/presentation/protocols/validators'
vi.mock('@/presentation/protocols/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_mail: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidations', () => {
  test('Should call Validation Composite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidateComposite).toHaveBeenCalledWith(validations)
  })
})
