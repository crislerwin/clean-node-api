import { accountSchema } from './account-schema'
import { loginParamsSchema } from './login-params-schema'
import { errorSchema } from './error-schema'
import { signUpParamsSchema } from './signup-params-schema'
import { saveSurveyParamsSchema } from './save-survey-params-schema'
import { surveyResultSchema } from './survey-result-schema'
import { addSurveyParamsSchema } from './add-survey-params-schema'
import { surveySchema } from './survey-schema'
import { surveysSchema } from './surveys-schema'
import { surveyAnswerSchema } from './survey-answer-schema'
import { surveyResultAnswerSchema } from './survey-result-answer.schema'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema,
}
