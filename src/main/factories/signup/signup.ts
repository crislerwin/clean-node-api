import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/encrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log'
import { SignupController } from '@/presentation/controllers/signup/signup'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signupController = new SignupController(dbAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
