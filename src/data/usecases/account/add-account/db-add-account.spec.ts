import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DbAddAccount } from './db-add-account'
import {
  AddAccountRepository,
  AddAccountParams,
  LoadAccountByEmailRepository,
  AccountModel,
  Hasher,
} from './db-add-account-protocols'
import { mockAccount } from '@/domain/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        // @ts-expect-error
        resolve(null)
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccount())
      })
    }
  }
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return addAccountRepositoryStub
}
const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('hashed_password')
      })
    }

    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => {
        resolve(true)
      })
    }
  }
  const encrypterStub = new HasherStub()
  return encrypterStub
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
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

    await sut.add(mockAccount())
    expect(encryptSpy).toHaveBeenCalledWith('hashed_password')
  })
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    vi.spyOn(hasherStub, 'hash').mockImplementationOnce(async (): Promise<string> => {
      return await new Promise((_resolve, reject) => {
        reject(new Error())
      })
    })

    const promise = sut.add(mockAccount())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAccount()
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
    const accountData = mockAccount()
    const promise = await sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAccount()
    const account = await sut.add(accountData)
    expect(account).toEqual(mockAccount())
  })
  test('Should  call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccount())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should return null if  LoadAccountByEmailRepository not return null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(mockAccount())
      }),
    )
    const account = await sut.add(mockAccount())
    expect(account).toBeNull()
  })
})
