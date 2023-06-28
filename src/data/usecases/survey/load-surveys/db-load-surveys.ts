import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-survey-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load(): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}