import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { BcryptAdapter } from '@/infra/criptography/encrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account-mongo-repository'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log-mongo-repository'
import { SignupController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

class AuthenticationRepository implements Authentication {
  async auth(_authentication: AuthenticationModel): Promise<string | null> {
    return null
  }
}

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const authenticationRepository = new AuthenticationRepository()
  const signupController = new SignupController(
    dbAccount,
    makeSignUpValidation(),
    authenticationRepository,
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
