import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel, LoadAccountByToken } from '../middlewares/auth-middleware-protocols'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel())
      })
    }
  }
  return new LoadAccountByTokenStub()
}
