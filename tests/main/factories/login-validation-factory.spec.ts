import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory'
import { describe, test, expect, vi } from 'vitest'
import {
  ValidationComposite,
  EmailValidation,
  EmailValidator,
  RequiredFieldValidation,
} from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
vi.mock('@/validation/validators/validation-composite')

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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
