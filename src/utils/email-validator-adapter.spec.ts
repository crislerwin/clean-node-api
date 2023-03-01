import { describe, expect, test, vi } from 'vitest'
import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    vi.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    const emailSpy = vi.spyOn(validator, 'isEmail')
    const sut = new EmailValidatorAdapter()
    sut.isValid('valid_email@mail.com')
    expect(emailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
