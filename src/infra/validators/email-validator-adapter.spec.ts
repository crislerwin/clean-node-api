import { describe, expect, test, vi } from 'vitest'
import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    vi.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = makeSut()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('any_email@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    const emailSpy = vi.spyOn(validator, 'isEmail')
    const sut = makeSut()
    sut.isValid('any_email@mail.com')
    expect(emailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
