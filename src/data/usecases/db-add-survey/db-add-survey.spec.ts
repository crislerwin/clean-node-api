import { describe, test, vi, expect } from 'vitest'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository, AddSurveyModel } from './add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
})
describe('DbAddSurvey', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add(data: AddSurveyModel): Promise<void> {
        await new Promise((resolve) => {
          resolve(null)
        })
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    await sut.add(makeFakeSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  })
})
