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

beforeEach(async () => {
  await surveyCollection.deleteMany({})
  await accountCollection.deleteMany({})
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
  test('Should return 204 on add survey with valid token', async () => {
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

    await server
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
      })
      .expect(204)
  })
})

describe('Get/survey', () => {
  test('Should return 403 on load surveys without access token', async () => {
    await server.get('/api/surveys').expect(403)
  })
  test('Should return 200 on load surveys with valid token', async () => {
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    })
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
    ])

    const accessToken = sign({ id: insertedId }, env.jwtSecret)
    await accountCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          accessToken,
        },
      },
    )

    await server.get('/api/surveys').set('x-access-token', accessToken).expect(200)
  })
})
