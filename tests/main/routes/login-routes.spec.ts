import { test, beforeAll, describe, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Express } from 'express'
import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { setupApp } from '@/main/config/app'

let app: Express
let accountCollection: Collection

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await MongoHelper.connect(mongoUri)
  accountCollection = await MongoHelper.getCollection('accounts')
  app = await setupApp()
})

beforeEach(async () => {
  await accountCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('Post /signup', () => {
  test('Should return 200 on signup', async () => {
    await request(app)
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

describe('Post /login', () => {
  test('Should return 200 on login', async () => {
    const password = await hash('any_password', 12)
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password,
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@email.com',
        password: 'any_password',
      })
      .expect(200)
  })
  test('Should return 401 on login if user not exists', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@email.com',
        password: 'any_password',
      })
      .expect(401)
  })
})
