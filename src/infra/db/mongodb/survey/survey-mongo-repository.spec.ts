import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'

import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

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

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

describe('Account Mongo Repository', async () => {
  let surveyCollection: Collection
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await MongoHelper.connect(uri)
    surveyCollection = await MongoHelper.getCollection('surveys')
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
          ],
          date: new Date(),
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
          ],
          date: new Date(),
        },
      ])
      const sut = makeSut()

      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
    })
    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load all surveys on success', async () => {
      const { insertedId } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      })
      const sut = makeSut()

      const survey = await sut.loadById(insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
