import { LogControllerDecorator } from './log-controller-decorator'
import { describe, expect, test, vi } from 'vitest'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { serverError } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/domain/test'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const error = serverError(fakeError)
  return error
}

const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => {
        resolve({
          statusCode: 200,
          body: {
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        })
      })
    }
  }
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = vi.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    })
  })
  test('Should call LogoErrorRepository with correct erro if controller returns a server error', async () => {
    const { sut, logErrorRepositoryStub, controllerStub } = makeSut()

    const logSpy = vi.spyOn(logErrorRepositoryStub, 'logError')
    vi.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(makeFakeServerError())
      }),
    )
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
