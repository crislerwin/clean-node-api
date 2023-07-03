export type SurveyResultModel = {
  id: string
  surveyId: string
  accountId?: string
  answer: string
  date: Date
}

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>
