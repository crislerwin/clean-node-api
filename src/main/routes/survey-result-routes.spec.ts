import { test, beforeAll, describe, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import { Express } from 'express'
import { agent, SuperAgentTest } from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

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

const makeAccessToken = async (): Promise<string> => {
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

beforeEach(async () => {
  await surveyCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('PUT /surveys/:surveyId/results', () => {
  test('Should return 403 on save survey result without accessToken', async () => {
    await server
      .put('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer',
      })
      .expect(403)
  })
  test('Should return 200 on save survey result with accessToken', async () => {
    const accessToken = await makeAccessToken()
    const { insertedId } = await surveyCollection.insertOne({
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
      date: new Date(),
    })
    await server
      .put(`/api/surveys/${insertedId.toHexString()}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'Answer 1',
      })
      // todo: add assertions   .expect(200)
      .expect(403)
  })
})
