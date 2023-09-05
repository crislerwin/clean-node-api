import { describe, expect, test, vi } from 'vitest'
import { LoginController } from '@/presentation/controllers'
import { throwError } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'
import { AuthenticationSpy, ValidationSpy } from '../mocks'
import { serverError, unauthorized, ok, badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy,
  }
}

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})

describe('Login Controller', () => {
  test('Should return 500 if Validator throws', async () => {
    const { sut, validationSpy: validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct value', async () => {
    const { sut, authenticationSpy: authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return 401 if invalid credentials is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    // @ts-expect-error
    authenticationSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy: authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    vi.spyOn(authenticationSpy, 'auth')
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy: validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest)
  })
  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy: validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
