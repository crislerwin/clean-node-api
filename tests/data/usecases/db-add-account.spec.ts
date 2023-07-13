import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  AccountModel,
  Hasher,
} from '@/data/usecases/account/add-account/db-add-account-protocols'
import { mockAddAccount, mockHasher, mockLoadAccountByEmail } from '@/tests/data/mocks'
import { mockAccountModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccount()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmail()
  vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
    // @ts-expect-error
    Promise.resolve(null),
  )

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  }
}

describe('DbAddAccount UseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = vi.spyOn(hasherStub, 'hash')

    await sut.add(mockAccountModel())
    expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
  })
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    vi.spyOn(hasherStub, 'hash').mockImplementationOnce(async (): Promise<string> => {
      return await Promise.reject(new Error())
    })

    const promise = sut.add(mockAccountModel())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAccountModel()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccount = async (): Promise<AccountModel> => {
      return await Promise.reject(new Error())
    }

    vi.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      addAccount as unknown as Promise<AccountModel>,
    )
    const accountData = mockAccountModel()
    const promise = await sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAccountModel()
    const account = await sut.add(accountData)
    expect(account).toEqual(mockAccountModel())
  })
  test('Should  call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountModel())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should return null if  LoadAccountByEmailRepository not return null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccountModel()),
    )
    const account = await sut.add(mockAccountModel())
    expect(account).toBeNull()
  })
})
