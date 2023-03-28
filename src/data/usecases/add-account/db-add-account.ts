import { Hasher } from '@/data/protocols/criptography/hasher'
import { AddAccountRepository } from '@/data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.encrypter.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add(
        Object.assign(accountData, { password: hashedPassword }),
      )
      return newAccount
    }
    return null
  }
}
