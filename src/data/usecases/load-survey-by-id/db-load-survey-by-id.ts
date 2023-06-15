import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/load-surveys-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById(id: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
