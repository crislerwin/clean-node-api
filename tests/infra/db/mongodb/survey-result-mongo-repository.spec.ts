import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyResultModel } from '@/domain/models/survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyResultCollection: Collection
let accountCollection: Collection
let surveyCollection: Collection
const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const makeFakeSurvey = async (): Promise<SurveyResultModel> => {
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
  const result = await surveyCollection.findOne({
    _id: insertedId,
  })
  return MongoHelper.map<SurveyResultModel>(result)
}

const mockAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())

  return insertedId.toHexString()
}

describe('SurveyMongoResultRepository()', async () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const accountId = await mockAccountId()
      const survey = await makeFakeSurvey()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
      })
      expect(surveyResult).toBeTruthy()
    })
  })
})
