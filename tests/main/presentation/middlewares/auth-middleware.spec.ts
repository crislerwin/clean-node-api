import { test, vi, expect, describe } from 'vitest'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { throwError } from '@/tests/domain/mocks'
import { makeLoadAccountByToken } from '../mocks'
import { LoadAccountByToken } from '@/domain/usecases'
import { HttpRequest } from '@/presentation/protocols'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
})

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub,
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { loadAccountByTokenStub, sut } = makeSut(role)
    const loadSpy = vi.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  test('Should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    vi.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        accountId: 'any_id',
      }),
    )
  })
  test('Should return 400 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    vi.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
