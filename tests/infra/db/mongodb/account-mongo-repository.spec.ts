import { test, describe, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

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
    test('Should add an account on success', async () => {
      const sut = new AccountMongoRepository()
      const isValid = await sut.add(mockAddAccountParams())
      expect(isValid).toBeTruthy()
    })
  })
  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.password).toBe(addAccountParams.password)
    })
    test('Should return null on loadByEmail fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = await accountCollection.findOne({ _id: insertedId })
      expect(fakeAccount?.accessToken).toBeFalsy()
      const accessToken = faker.string.uuid()
      await sut.updateAccessToken(fakeAccount?._id.toHexString() ?? '', accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount?._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe(accessToken)
    })
  })

  describe('checkByEmail()', () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const exists = await sut.checkByEmail(addAccountParams.email)
      expect(exists).toBe(true)
    })

    test('Should return false if email is not valid', async () => {
      const sut = makeSut()
      const exists = await sut.checkByEmail(faker.internet.email())
      expect(exists).toBe(false)
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
      expect(fakeAccount?.accessToken).toBeFalsy()
      const accessToken = faker.string.uuid()
      await sut.updateAccessToken(fakeAccount?._id.toString() ?? '', accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount?._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe(accessToken)
    })
  })

  describe('loadByToken()', () => {
    let name = faker.person.firstName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.string.uuid()

    beforeEach(() => {
      name = faker.person.firstName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.string.uuid()
    })

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      })
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeFalsy()
    })
  })
})
