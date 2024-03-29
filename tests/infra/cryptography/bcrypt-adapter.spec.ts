import { describe, expect, test, vi } from 'vitest'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/encrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): BcryptAdapter => {
  vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<boolean> => {
    return await Promise.resolve(true)
  })
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = vi.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toBeCalledWith('any_value', salt)
    })
    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()
      vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        return await Promise.resolve('hash')
      })
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })
    test('Should throws if bcrypt throws', async () => {
      const sut = makeSut()
      // @ts-expect-error
      vi.spyOn(bcrypt, 'hash').mockReturnValueOnce(async () => {
        return await Promise.reject(new Error())
      })
      const promise = await sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const hashSpy = vi.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(hashSpy).toBeCalledWith('any_value', 'any_hash')
    })
    test('Should return a true when compare succeds', async () => {
      const sut = makeSut()
      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })
    test('Should return a false when compare fails', async () => {
      const sut = makeSut()
      vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
        return await Promise.resolve(false)
      })

      const isValid = await sut.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })
    test('Should throws if bcrypt throws', async () => {
      const sut = makeSut()
      // @ts-expect-error
      vi.spyOn(bcrypt, 'compare').mockReturnValueOnce(async () => {
        return await Promise.reject(new Error())
      })
      const promise = await sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
