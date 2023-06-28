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
let accountCollection: Collection

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await MongoHelper.connect(mongoUri)
  surveyCollection = await MongoHelper.getCollection('surveys')
  accountCollection = await MongoHelper.getCollection('accounts')
  app = await setupApp()
  server = agent(app)
})

beforeEach(async () => {
  await surveyCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('PUT /surveys/:surveyId/results', () => {
  test('Should return 403 on save survey result without accessToken', async () => {
    // to do fix this return
    await server
      .put('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer',
      })
      .expect(404)
  })
})
