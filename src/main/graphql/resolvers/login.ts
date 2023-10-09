import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoginController } from '@/main/factories/controllers'

export const resolvers = {
  Query: {
    login: async (_parent: any, args: any) => await adaptResolver(makeLoginController(), args),
  },
}
