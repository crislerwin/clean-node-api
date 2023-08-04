import { CheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository'
import { Hasher, AddAccountRepository, AddAccount } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    let isValid = false
    if (!exists) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const validAccount = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword,
      })
      isValid = !!validAccount
    }
    return isValid
  }
}
