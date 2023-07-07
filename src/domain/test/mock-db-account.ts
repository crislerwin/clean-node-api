import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
} from '@/data/usecases/load-account-by-token/db-load-account-by-token-protocols'
import { mockAccountModel } from './mock-account'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'

export const mockAddAccount = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel())
      })
    }
  }
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return addAccountRepositoryStub
}

export const mockLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel())
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByToken = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel())
      })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await new Promise((resolve) => {
        resolve('any_token')
      })
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
