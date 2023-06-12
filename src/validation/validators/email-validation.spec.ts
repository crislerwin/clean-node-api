import { InvalidParamError } from '@/presentation/errors'
import { expect, describe, test, vi } from 'vitest'
import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_mail: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type Sutypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): Sutypes => {
  const sut = new EmailValidation('email', makeEmailValidator())
  const emailValidatorStub = makeEmailValidator()
  return {
    sut,
    emailValidatorStub,
  }
}

describe('EmailValidator', () => {
  test('should ', () => {
    test('should return an erro if EmailValidator returns false', () => {
      const { sut, emailValidatorStub } = makeSut()
      vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const error = sut.validate({
        email: 'any_email@email.com',
      })
      expect(error).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')
      sut.validate({
        email: 'any_email@email.com',
      })
      expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('should sut throws if isValid throws', () => {
      const { sut, emailValidatorStub } = makeSut()
      vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      expect(sut.validate).toThrow()
    })
  })
})
