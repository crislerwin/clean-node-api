import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

let surveyResultCollection: Collection
let accountCollection: Collection
let surveyCollection: Collection
const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const { insertedId } = await surveyResultCollection.insertOne({
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'other_answer' }],
    date: 'any_date',
  })
  const result = await surveyCollection.findOne({
    _id: insertedId,
  })
  return MongoHelper.map<SurveyModel>(result)
}

const makeFakeAccount = async (): Promise<AccountModel | null> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
  })
  const result = await accountCollection.findOne({
    _id: insertedId,
  })
  return result && (await MongoHelper.map(result))
}

describe('SurveyMongoResultRepository()', async () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await MongoHelper.connect(uri)
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyCollection = await MongoHelper.getCollection('surveys')
  })

  beforeEach(async () => {
    await surveyResultCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const account = await makeFakeAccount()
      const sut = makeSut()
      const survey = await makeFakeSurvey()
      if (!survey) return
      if (!account) return
      const surveyResult = await sut.save({
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
        surveyId: survey.id,
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
