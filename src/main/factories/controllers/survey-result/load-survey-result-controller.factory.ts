import { LoadSurveyResultController } from '@/presentation/controllers/survey/load-survey-result/load-survey-result-controller'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { makeDbCheckSurveyById } from '../../usecases/survey/survey-result/check-survey-by-id-factory'
import { makeDbLoadSurveyResult } from '../../usecases/survey/load-surveys/load-survey-result-factory'

export const makeDbLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult(),
  )
  return makeLogControllerDecorator(controller)
}
