import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { mockAccountModel } from '../../domain/mocks'
import { CheckAccountByEmailRepository } from '../protocols/db/account/check-account-by-email-repository'
import { faker } from '@faker-js/faker'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
} from '../protocols/db/account'
import { AccountModel } from '@/domain/models/account'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params!: AddAccountRepository.Params
  result = true

  async add(params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token!: string
  role?: string
  result = {
    id: faker.string.uuid(),
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email!: string
  result = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export const mockLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await Promise.resolve('any_token')
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  email!: string
  result = false

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id!: string
  token!: string

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
