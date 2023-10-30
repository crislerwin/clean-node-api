import { InvalidParamError } from '@/presentation/errors'
import { expect, describe, test, vi } from 'vitest'
import { EmailValidation } from '@/validation/validators/email-validation'
import { throwError } from '@/tests/domain/mocks'
import { EmailValidatorSpy } from '../mocks'
import { faker } from '@faker-js/faker'

type Sutypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}
const field = faker.word.sample()
const makeSut = (): Sutypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy,
  }
}

describe('EmailValidator', () => {
  test('should return an erro if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()
    vi.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({
      [field]: email,
    })
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()

    sut.validate({
      [field]: email,
    })
    expect(emailValidatorSpy.email).toBe(email)
  })

  test('should sut throws if isValid throws', () => {
    const { sut, emailValidatorSpy } = makeSut()
    vi.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
