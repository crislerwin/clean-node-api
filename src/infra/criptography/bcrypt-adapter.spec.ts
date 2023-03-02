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
})
