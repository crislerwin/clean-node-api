export type SurveyResultModel = {
  id: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}

export type SurveyResultAnswerModel = {
  image: string
  answer: string
}
