import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidateComposite,
  Validation,
} from '@/validation/validators'

export const makeLoginValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidateComposite(validations)
}
