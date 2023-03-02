import { AccountModel, AddAccountModel, Encrypter } from './db-add-account-protocols'
import { describe, expect, test, vi } from 'vitest'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '@/data/protocols/add-account-repository'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'hashed_password',
        }
        resolve(fakeAccount)
      })
    }
  }
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return addAccountRepositoryStub
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('hashed_password')
      })
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = vi.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    vi.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async (): Promise<any> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'invalid_password',
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })
})
