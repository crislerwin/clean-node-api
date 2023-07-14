import { accountSchema } from './account-schema'
import { loginParamsSchema } from './login-params-schema'
import { errorSchema } from './error-schema'
import { signUpParamsSchema } from './signup-params-schema'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  signUpParams: signUpParamsSchema,
}
