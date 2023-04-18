import { test, beforeAll, describe, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import { Express } from 'express'
import { agent, SuperAgentTest } from 'supertest'
import { Collection } from 'mongodb'

let app: Express
let server: SuperAgentTest
let surveyCollection: Collection

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await MongoHelper.connect(mongoUri)
  surveyCollection = await MongoHelper.getCollection('surveys')
  app = await setupApp()
  server = agent(app)
})

beforeEach(async () => {
  await surveyCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('Post /survey', () => {
  test('Should return 403 on add survey without accessToken', async () => {
    await server
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
})
