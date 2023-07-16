import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { SurveyResultModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyResultModel[]> {
      return await Promise.resolve(mockSurveyModels())
    }
  }
  return new LoadSurveysRepositoryStub()
}
