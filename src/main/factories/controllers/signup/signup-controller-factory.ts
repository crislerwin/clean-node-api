import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { SignupController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

class AuthenticationRepository implements Authentication {
  async auth(_authentication: AuthenticationModel): Promise<string | null> {
    return null
  }
}

export const makeSignUpController = (): Controller => {
  const authenticationRepository = new AuthenticationRepository()
  return makeLogControllerDecorator(
    new SignupController(makeDbAccount(), makeSignUpValidation(), authenticationRepository),
  )
}
