import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Account Mongo Repository', async () => {
  let accountCollection: Collection
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await MongoHelper.connect(uri)
    accountCollection = await MongoHelper.getCollection('accounts')
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
  test('Should return null on loadByEmail fails', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })
  test('Should update account accssToken on update', async () => {
    const sut = new AccountMongoRepository()
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
    const createdAccount = await sut.loadByEmail('any_email@mail.com')
    expect(createdAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(insertedId.toString(), 'any_token')
    const updatedAccount = await sut.loadByEmail('any_email@mail.com')
    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount.accessToken).toBe('any_token')
  })
})