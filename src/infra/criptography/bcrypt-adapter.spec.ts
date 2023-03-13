import { describe, expect, test, vi } from 'vitest'
import { BcryptAdapter } from './encrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): BcryptAdapter => {
  vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<boolean> => {
    return await new Promise((resolve) => {
      resolve(true)
    })
  })
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })
  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async (): Promise<string> => {
      return await new Promise((resolve) => {
        resolve('hash')
      })
    })
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })
  test('Should throws if bcrypt throws', async () => {
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
    vi.spyOn(bcrypt, 'compare').mockImplementationOnce(async (): Promise<boolean> => {
      return await new Promise((resolve) => {
        resolve(false)
      })
    })

    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })
})
