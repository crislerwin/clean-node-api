import { describe, expect, test, vi } from 'vitest'
import { DbAuthentication } from './db-authentication'
import {
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  Encrypter,
  HashComparer,
  AccountModel,
  AuthenticationParams,
} from './db-authentication-protocols'
import { mockEncrypter, mockAccountModel, throwError, mockHashComparer } from '@/domain/test'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel())
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await new Promise((resolve) => {
        resolve('any_token')
      })
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,

    encrypterStub,
    updateAccessTokenRepositoryStub,
  }
}
const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

describe('DbAuthentication Usecase', () => {
  test('Should  call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      null as unknown as Promise<AccountModel>,
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = vi.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashCompare returns false', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(false)
      }),
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = vi.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should  throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    vi.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessTokeRepository  with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('Should  throw if UpdateAccessTokeRepository throws', async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut()
    vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(
      throwError,
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
