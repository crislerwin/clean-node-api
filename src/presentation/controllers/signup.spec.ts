import { describe, expect, test, vitest } from 'vitest'
import { EmailValidator } from '../protocols'
import { SignupController } from './signup'
import { InvalidParamError, MissingPararmError, ServerError } from '../errors'
import { AddAccount, AddAccountModel } from '../protocols/domain/usecases/add-account'
import { AccountModel } from '../protocols/domain/models/accont'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_mail: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      throw new ServerError()
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(_account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAcountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidator = makeEmailValidator()
  const sut = new SignupController(emailValidator, addAccountStub)
  return {
    sut,
    emailValidatorStub: emailValidator,
    addAcountStub: addAccountStub,
  }
}
describe('Signup Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingPararmError('name'))
  })
  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingPararmError('email'))
  })
  test('should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        email: 'invalid_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('should return 400 if password validate fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'wrong_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = vitest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should return 500 if email validator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError()
    const addAccountStub = makeAddAccount()
    const sut = new SignupController(emailValidatorStub, addAccountStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingPararmError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingPararmError('passwordConfirmation'))
  })
  test('should call', () => {
    const { sut, addAcountStub } = makeSut()
    const addSpy = vitest.spyOn(addAcountStub, 'add')

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    })
  })
})
