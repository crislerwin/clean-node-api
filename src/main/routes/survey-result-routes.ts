import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { auth } from '../factories/middlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller.factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
