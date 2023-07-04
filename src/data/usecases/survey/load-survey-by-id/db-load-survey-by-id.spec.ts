import { beforeAll, describe, expect, test, vi } from 'vitest'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import { throwError } from '@/domain/test'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeSurvey())
      })
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub,
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = vi.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })
  test('Should  throw if LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    vi.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
