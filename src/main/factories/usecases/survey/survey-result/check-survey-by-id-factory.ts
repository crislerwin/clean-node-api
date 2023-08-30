import { DbCheckSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { CheckSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}
