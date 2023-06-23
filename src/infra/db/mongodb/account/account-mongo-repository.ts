import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: insertedId })
    return MongoHelper.map<AccountModel>(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map<AccountModel>(account)
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
