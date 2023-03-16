import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/encrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { SignupController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signupController = new SignupController(dbAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
