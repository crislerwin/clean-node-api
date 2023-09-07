import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection, ObjectId, WithId } from 'mongodb'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'

let surveyResultCollection: Collection
let accountCollection: Collection
let surveyCollection: Collection
const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const mockSurvey = async (): Promise<LoadSurveyResultRepository.Result> => {
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
  const result = (await surveyCollection.findOne({
    _id: insertedId,
  })) as WithId<Collection>
  return await MongoHelper.mapSurvey(result)
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
      const survey = await mockSurvey()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.surveyId,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.surveyId),
        accountId: new ObjectId(accountId),
      })
      expect(surveyResult).toBeTruthy()
    })
  })
  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.surveyId, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.surveyId)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers.length).toBe(survey.answers.length)
    })

    test('Should load survey result 2', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId3),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.surveyId, accountId2)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.surveyId)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers.length).toBe(survey.answers.length)
    })

    test('Should load survey result 3', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.surveyId),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.surveyId, accountId3)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.surveyId)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers.length).toBe(survey.answers.length)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.surveyId, accountId)
      expect(surveyResult).toBeNull()
    })
  })
})
