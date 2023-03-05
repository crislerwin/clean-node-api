import { describe, test } from 'vitest'
import request from 'supertest'
import { InMemoryMongoDbHelper } from '../../infra/db/mongodb/helpers/in-memory-mongo-helper'
import app from '../config/app'

describe('Signup Routes', async () => {
  await InMemoryMongoDbHelper.setup()
  await InMemoryMongoDbHelper.teardown()
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      })
      .expect(200)
  })
})
