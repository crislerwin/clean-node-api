import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/encrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account-mongo-repository'

class LoadAccountByEmail implements LoadAccountByEmailRepository {
  async loadByEmail(email: string): Promise<AccountModel | null> {
    return null
  }
}

export const makeDbAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository = new LoadAccountByEmail()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, loadAccountByEmailRepository)
}
