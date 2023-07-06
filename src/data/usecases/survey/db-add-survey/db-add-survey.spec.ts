import { describe, test, vi, expect, beforeEach, afterEach } from 'vitest'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyParams } from './add-survey-protocols'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { mockAddSurveyRepository } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub,
  }
}
describe('DbAddSurvey', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  test('should call AddSurveyRepository with correct values', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })
  test('Should throw if Hasher throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    vi.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async (): Promise<any> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
