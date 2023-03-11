import { EmailValidation } from '@/presentation/protocols/validators/email-validation'
import { RequiredFieldValidation } from '@/presentation/protocols/validators/required-field-validation'
import { Validation } from '@/presentation/protocols/validators/validation'
import { ValidateComposite } from '@/presentation/protocols/validators/validation-composite'
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'

export const makeLoginValidation = (): ValidateComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidateComposite(validations)
}
