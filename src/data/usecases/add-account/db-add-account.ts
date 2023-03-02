import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { Encrypter, AccountModel, AddAccount, AddAccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const newAccount = await this.addAccountRepository.add(
      Object.assign(accountData, { password: hashedPassword }),
    )
    return await new Promise((resolve) => {
      resolve(newAccount)
    })
  }
}
