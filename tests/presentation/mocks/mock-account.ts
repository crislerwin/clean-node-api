import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel, LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
