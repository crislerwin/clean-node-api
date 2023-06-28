import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey/save-survey-result/save-survey-result-controller'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/add-survey/load-surveys/db-load-surveys-factory'
import { makeSaveSurveyResult } from '@/main/factories/usecases/survey/survey-result/save-survey-result/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
