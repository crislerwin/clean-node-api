import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    CheckAccountByEmailRepository,
    LoadAccountByEmailRepository
{
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    return insertedId !== null
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email,
      },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1,
        },
      },
    )
    return await MongoHelper.map(account)
  }

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email,
      },
      {
        projection: {
          _id: 1,
        },
      },
    )
    return account !== null
  }

  async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const response = await accountCollection.findOne({
      accessToken,
      $or: [
        {
          role,
        },
        {
          role: 'admin',
        },
      ],
    })
    return MongoHelper.map<AccountModel>(response)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    await (
      await MongoHelper.getCollection('accounts')
    ).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      },
    )
  }
}
