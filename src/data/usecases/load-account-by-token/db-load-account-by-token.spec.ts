import { describe, test, expect, vi } from 'vitest'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols'
import { mockDecrypter, mockLoadAccountByToken } from '@/tests/data/mocks'
import { mockAccountModel, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByToken()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  }
}
describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return null if Decrypter returns null', async () => {
    const { decrypterStub, sut } = makeSut()
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise((resolve) => {
        // @ts-expect-error
        resolve(null)
      }),
    )
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = vi.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
  test('Should return null LoadAccountByTokenRepository returns null.', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
      new Promise((resolve) => {
        // @ts-expect-error
        resolve(null)
      }),
    )
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    vi.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
