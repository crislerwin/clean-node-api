import { describe, expect, test, vi } from 'vitest'
import { BcryptAdapter } from './encrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  test('Should call EncryptAdapter with correct values', async () => {
    const sut = makeSut()
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })
  test('Should return a hash on success', async () => {
    const sut = makeSut()
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async (): Promise<string> => {
      return await new Promise((resolve) => {
        resolve('hash')
      })
    })
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })
  test('Should throws if bcrypt thros', async () => {
    const sut = makeSut()
    const bcryptMock = async (): Promise<string> => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    }
    vi.spyOn(bcrypt, 'hash').mockReturnValueOnce(bcryptMock as any)
    const promise = await sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
