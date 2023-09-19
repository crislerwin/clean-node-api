import { describe, test, expect, vi, beforeEach } from 'vitest'
import { DecrypterSpy, mockLoadAccountByToken } from '@/tests/data/mocks'
import { mockAccountModel, throwError } from '@/tests/domain/mocks'
import { DbLoadAccountByToken } from '@/data/usecases'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByToken()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositoryStub,
  }
}
let token: string
let role: string
describe('DbLoadAccountByToken UseCase', () => {
  beforeEach(() => {
    token = faker.string.uuid()
    role = faker.word.sample(4)
  })
  test('Should call Decrypter with correct cyphertext', async () => {
    const { decrypterSpy, sut } = makeSut()
    await sut.load(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })
  test('Should return null if Decrypter returns null', async () => {
    const { decrypterSpy: decrypterStub, sut } = makeSut()
    // @ts-expect-error
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
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
      // @ts-expect-error
      Promise.resolve(null),
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
    const { sut, decrypterSpy: decrypterStub } = makeSut()
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
