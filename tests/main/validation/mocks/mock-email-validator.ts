import { EmailValidator } from '@/validation/validators'

export class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true
  email: string | undefined
  isValid(mail: string): boolean {
    this.email = mail
    return this.isEmailValid
  }
}
