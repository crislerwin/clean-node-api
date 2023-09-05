import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey-controller.factory'
import { adminAuth } from '../factories/middlewares/admin-auth'
import { auth } from '../factories/middlewares/auth'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys-controller.factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
