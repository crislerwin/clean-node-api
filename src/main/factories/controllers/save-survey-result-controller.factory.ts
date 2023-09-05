import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey/save-survey-result-factory'
import { makeDbLoadAnswersBySurvey } from '../usecases/survey/load-surveys/load-answers-by-survey-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult(),
  )
  return makeLogControllerDecorator(controller)
}
