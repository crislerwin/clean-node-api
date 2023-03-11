import { LoadAccountByEmailRepository } from '@/data/protocols/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { describe, expect, test, vi } from 'vitest'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        const account = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'valid_password',
        }
        return await new Promise((resolve) => {
          resolve(account)
        })
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
})
