import { adaptResolver } from '@/main/adapters'
import {
  makeDbLoadSurveyResultController,
  makeSaveSurveyResultController,
} from '@/main/factories/controllers'

export default {
  Query: {
    surveyResult: async (_parent: any, args: any, context: any) =>
      await adaptResolver(makeDbLoadSurveyResultController(), args, context),
  },
  Mutation: {
    saveSurveyResult: async (_parent: any, args: any, context: any) =>
      await adaptResolver(makeSaveSurveyResultController(), args, context),
  },
}
