import { test, beforeAll, describe, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import { Express } from 'express'
import { agent, SuperAgentTest } from 'supertest'

let app: Express
let server: SuperAgentTest

describe('Login Routes', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await MongoHelper.connect(mongoUri)
    app = await setupApp()
    server = agent(app)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 on signup', async () => {
    await server
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      })
      .expect(200)
  })
})
