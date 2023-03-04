import { describe, test } from 'vitest'
import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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
