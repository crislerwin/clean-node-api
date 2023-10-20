import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoginController, makeSignUpController } from '@/main/factories/controllers'

export default {
  Query: {
    login: async (_parent: any, args: any) => await adaptResolver(makeLoginController(), args),
  },
  Mutation: {
    signUp: async (_parent: any, args: any) => await adaptResolver(makeSignUpController(), args),
  },
}
