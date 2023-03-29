import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidateComposite,
  Validation,
} from '@/validation/validators'

export const makeSignUpValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidateComposite(validations)
}
