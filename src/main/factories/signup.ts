import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/encrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository/log'
import { SignupController } from '@/presentation/controllers/signup/signup'
import { Validation } from '@/presentation/helpers/validators/validation'
import { Controller } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

class Validator implements Validation {
  validate(input: any): Error {
    return new Error()
  }
}

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validation = new Validator()
  const signupController = new SignupController(emailValidator, dbAccount, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
