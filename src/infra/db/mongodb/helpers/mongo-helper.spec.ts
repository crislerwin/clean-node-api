import { MongoHelper as sut } from './mongo-helper'
import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await sut.connect(uri)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
  })
})
