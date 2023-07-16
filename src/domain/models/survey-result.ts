export type SurveyResultModel = {
  id: string
  surveyId: string
  accountId?: string
  answer: string
  count: number
  percent: number
  date: Date
}

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>
