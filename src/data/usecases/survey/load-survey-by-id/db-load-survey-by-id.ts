import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import {
  LoadSurveyById,
  SurveyResultModel,
} from '../save-survey-result/db-save-survey-result.protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById(id: string): Promise<SurveyResultModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
