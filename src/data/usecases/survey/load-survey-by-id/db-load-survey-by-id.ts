import { CheckSurveyById } from '../save-survey-result/db-save-survey-result.protocols'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor(private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}
  async checkById(id: string): Promise<CheckSurveyById.Result> {
    return await this.checkSurveyByIdRepository.checkById(id)
  }
}
