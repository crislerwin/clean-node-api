import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultRepository } from '../protocols/db/survey/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = this.makeEmptyResult(survey)
    }
    return surveyResult
  }

  private makeEmptyResult(survey: SurveyModel): SurveyResultModel {
    return {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false,
      })),
    }
  }
}
