import { SignupController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(
    new SignupController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()),
  )
}
