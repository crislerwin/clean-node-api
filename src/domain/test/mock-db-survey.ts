import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '../usecases/survey/add-survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '../models/survey'
import { mockSurveyModel, mockSurveyModels } from './mock-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      await new Promise((resolve) => {
        resolve(null)
      })
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => {
        resolve(mockSurveyModel())
      })
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await new Promise((resolve) => {
        resolve(mockSurveyModels())
      })
    }
  }
  return new LoadSurveysRepositoryStub()
}
