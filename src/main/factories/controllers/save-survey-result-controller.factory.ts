import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { makeDbLoadAnswersBySurvey } from '../usecases/load-answers-by-survey-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult(),
  )
  return makeLogControllerDecorator(controller)
}
