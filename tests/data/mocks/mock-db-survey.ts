import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks'
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '../protocols/db/survey/load-answers-by-survey-repository'
import { faker } from '@faker-js/faker'
import { CheckSurveyByIdRepository } from '../protocols/db/survey/check-survey-by-id-repository'
import { LoadSurveysRepository } from '../protocols/db/survey'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  params!: AddSurveyRepository.Params
  async add(params: AddSurveyRepository.Params): Promise<void> {
    this.params = params
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id!: string
  result = mockSurveyModel()

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  id!: string
  result = [faker.lorem.word(), faker.lorem.word()]

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return this.result
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId!: string
  result = mockSurveyModels()

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return this.result
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id!: string
  result = true

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}
