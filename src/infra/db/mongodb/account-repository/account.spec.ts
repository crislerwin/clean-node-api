import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import { InMemoryMongoDbHelper } from '../helpers/in-memory-mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', async () => {
  beforeAll(async () => {
    await InMemoryMongoDbHelper.setup()
  })
  afterAll(async () => {
    await InMemoryMongoDbHelper.teardown()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
