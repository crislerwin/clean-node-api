import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories/controllers/load-surveys-controller.factory'

export default {
  Query: {
    surveys: async (_parent: any, args: any, context: any) =>
      await adaptResolver(makeLoadSurveysController(), args, context),
  },
}
