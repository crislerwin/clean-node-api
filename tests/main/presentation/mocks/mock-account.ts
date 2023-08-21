import { Authentication } from '@/domain/usecases/account/authentication'
import {
  AccountModel,
  LoadAccountByToken,
} from '@/presentation/middlewares/auth-middleware-protocols'
import { mockAccountModel } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

export class AuthenticationSpy implements Authentication {
  params!: Authentication.Params
  result = {
    accessToken: faker.string.uuid(),
    name: faker.person.firstName(),
  }

  async auth(params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}
