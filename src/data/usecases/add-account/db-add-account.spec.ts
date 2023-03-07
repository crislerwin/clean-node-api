import { AccountModel, AddAccountModel, Encrypter } from './db-add-account-protocols'
import { describe, expect, test, vi } from 'vitest'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '@/data/protocols/add-account-repository'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount())
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
const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = vi.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    vi.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async (): Promise<any> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccount = async (): Promise<AccountModel> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    }

    vi.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      addAccount as unknown as Promise<AccountModel>,
    )
    const accountData = makeFakeAccountData()
    const promise = await sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should retyrb an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })
})
