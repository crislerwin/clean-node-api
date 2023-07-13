import { describe, expect, test, vi } from 'vitest'
import { DbAuthentication } from '@/data/usecases/account/add-account/authentication/db-authentication'
import {
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  Encrypter,
  HashComparer,
  AccountModel,
} from '@/data/usecases/account/add-account/authentication/db-authentication-protocols'
import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmail,
  mockUpdateAccessTokenRepository,
} from '@/tests/data/mocks'
import { mockAuthentication, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmail()
  const hashCompareStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
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

describe('DbAuthentication Usecase', () => {
  test('Should  call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthentication())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      null as unknown as Promise<AccountModel>,
    )
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = vi.spyOn(hashCompareStub, 'compare')
    await sut.auth(mockAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashCompare returns false', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = vi.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should  throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    vi.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessTokeRepository  with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('Should  throw if UpdateAccessTokeRepository throws', async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut()
    vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(
      throwError,
    )
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
