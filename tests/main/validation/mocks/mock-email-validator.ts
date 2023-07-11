import { EmailValidator } from '@/validation/validators'

export class EmailValidatorSpy implements EmailValidator {
  isValid(mail: string): boolean {
    return true
  }
}
