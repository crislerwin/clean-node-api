import { AccountModel } from '../models/account'
import { AddAccount, AddAccountParams } from '../usecases/account/add-account'
import { AuthenticationParams } from '../usecases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
})

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = mockAccountModel()
      return await new Promise((resolve) => {
        resolve(fakeAccount)
      })
    }
  }
  return new AddAccountStub()
}
export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})
