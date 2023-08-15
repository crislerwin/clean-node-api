import { test, beforeAll, describe, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import { Express } from 'express'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

describe('Survey Routes', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await MongoHelper.connect(mongoUri)

    app = await setupApp()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  const mockAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      role: 'admin',
    })
    const id = res.insertedId
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken,
        },
      },
    )
    return accessToken
  }

  describe('Post /survey', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer',
            },
          ],
        })
        .expect(403)
    })
    test('Should return 204 on add survey with valid token', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(204)
    })
  })

  describe('Get/survey', () => {
    test('Should return 403 on load surveys without access token', async () => {
      await request(app).get('/api/surveys').expect(403)
    })
    test('Should return 204 on load surveys with valid token', async () => {
      const accessToken = await mockAccessToken()
      await request(app).get('/api/surveys').set('x-access-token', accessToken).expect(204)
    })
  })
})
