import { test, vi, expect, describe } from 'vitest'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '../controllers/login/signup/signup-controller-protocols'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount())
      })
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
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
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { loadAccountByTokenStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token',
      },
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
