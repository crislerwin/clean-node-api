import { LoadSurveyResultController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { makeDbCheckSurveyById } from '../usecases/check-survey-by-id-factory'
import { makeDbLoadSurveyResult } from '../usecases/load-survey-result-factory'

export const makeDbLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult(),
  )
  return makeLogControllerDecorator(controller)
}
