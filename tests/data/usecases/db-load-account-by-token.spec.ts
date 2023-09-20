import { describe, test, expect, vi, beforeEach } from 'vitest'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import { DbLoadAccountByToken } from '@/data/usecases'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
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
    const { decrypterSpy, sut } = makeSut()
    // @ts-expect-error
    decrypterSpy.plaintext = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const loadByTokenSpy = vi.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
    await sut.load(token, role)
    expect(loadByTokenSpy).toHaveBeenCalledWith(token, role)
  })
  test('Should return null LoadAccountByTokenRepository returns null.', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    // @ts-expect-error
    loadAccountByTokenRepositorySpy.result = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load(token, role)
    expect(account).toEqual(loadAccountByTokenRepositorySpy.result)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy: decrypterStub } = makeSut()
    vi.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })
  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    vi.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })
})
