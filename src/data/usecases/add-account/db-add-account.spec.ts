import { describe, expect, test, vi } from 'vitest'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return await new Promise((resolve) => {
          resolve('hashed_password')
        })
      }
    }
    const encrypterStub = new EncrypterStub()
    const encryptSpy = vi.spyOn(encrypterStub, 'encrypt')
    const sut = new DbAddAccount(encrypterStub)
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
