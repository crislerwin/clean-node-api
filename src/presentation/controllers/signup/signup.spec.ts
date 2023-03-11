import { describe, expect, test, vi } from 'vitest'
import { SignupController } from './signup'
import { AccountModel } from '@/domain/models/account'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator } from '@/presentation/protocols/validators'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from './signup-protocols'
import { MissingPararmError, ServerError } from '@/presentation/errors'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
    passwordConfirmation: 'valid_password',
  },
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_mail: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await new Promise((resolve) => {
        resolve(fakeAccount)
      })
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAcountStub: AddAccount
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error {
      return null as any
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const addAcountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const sut = new SignupController(addAcountStub, validationStub)

  return {
    sut,
    emailValidatorStub,
    addAcountStub,
    validationStub,
  }
}
describe('Signup Controller', () => {
  test('should call AddAccount and return the correct values', async () => {
    const { sut, addAcountStub } = makeSut()
    const addSpy = vi.spyOn(addAcountStub, 'add')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAcountStub } = makeSut()
    const addAccountMock = async (): Promise<any> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    }
    vi.spyOn(addAcountStub, 'add').mockImplementationOnce(addAccountMock)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingPararmError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingPararmError('any_field')))
  })
})
