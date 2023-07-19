import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysRepository } from './db-load-survey-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(accountId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
