import { MissingPararmError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'
import { describe, expect, test } from 'vitest'
import { LoginController } from './login'
describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingPararmError('email')))
  })
})
