import { describe, expect, test, vi } from 'vitest'
import { BcryptAdapter } from './encrypt-adapter'
import bcrypt from 'bcrypt'

describe('BcryptAdapter', () => {
  test('Should call EncryptAdapter with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })
  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async (): Promise<string> => {
      return await new Promise((resolve) => {
        resolve('hash')
      })
    })
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
