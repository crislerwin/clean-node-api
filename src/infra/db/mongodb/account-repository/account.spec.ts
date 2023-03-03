import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    const inMemoryServer = await MongoMemoryServer.create()
    const uri = inMemoryServer.getUri()
    await MongoHelper.connect(uri)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
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
