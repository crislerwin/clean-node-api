import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { auth } from '../factories/middlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controllers/save-survey-result-controller.factory'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys-controller.factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveysController()))
}
