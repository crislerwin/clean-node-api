import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation'
import { ValidateComposite } from '@/presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidateComposite => {
  return new ValidateComposite([
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
  ])
}
