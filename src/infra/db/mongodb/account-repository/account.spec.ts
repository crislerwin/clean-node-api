import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import { AccountMongoRepository } from './account'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', async () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
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
