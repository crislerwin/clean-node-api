import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysRepository, SurveyResultModel } from './db-load-survey-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load(): Promise<SurveyResultModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}
