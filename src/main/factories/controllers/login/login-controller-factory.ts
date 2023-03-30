import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factor'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation()),
  )
}
