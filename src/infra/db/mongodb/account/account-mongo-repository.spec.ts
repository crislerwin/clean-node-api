import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAddAccountParams } from '@/tests/domain/mocks'

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

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })
  })
  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })
    test('Should return null on loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update account accessToken on update', async () => {
      const sut = new AccountMongoRepository()
      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
      const createdAccount = await sut.loadByEmail('any_email@mail.com')
      expect(createdAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(insertedId.toString(), 'any_token')
      const updatedAccount = await sut.loadByEmail('any_email@mail.com')
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount.accessToken).toBe('any_token')
    })
  })
  describe('loadByToken', () => {
    test('Should return an account on  loadByToken success', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password',
        accessToken: 'any_token',
      })

      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('hashed_password')
    })
    test('Should return an account on loadByToken with admin role', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'hashed_password',
        accessToken: 'any_token',
        role: 'admin',
      })

      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('hashed_password')
    })
    test('Should return null on loadByToken with invalid role', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'hashed_password',
        accessToken: 'any_token',
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = new AccountMongoRepository()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'hashed_password',
        accessToken: 'any_token',
        role: 'admin',
      })

      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('hashed_password')
    })
    test('Should return null on  loadByToken fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
