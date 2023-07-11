import { describe, expect, test, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('Jwt Adapter', () => {
  describe('Sign', () => {
    test('Should call sign with correct values ', async () => {
      const sut = makeSut()
      const signSpy = vi.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign').mockImplementationOnce(() => 'any_token')
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
    test('Should throw if sign throws ', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
        return await new Promise((_resolve, reject) => {
          reject(new Error())
        })
      })

      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('veryfy()', () => {
    test('Should call veryfy with correct values ', async () => {
      const sut = makeSut()
      const verifySpy = vi.spyOn(jwt, 'verify').mockImplementationOnce(() => 'any_value')

      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => 'any_value')
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
    test('Should throw if verify throws ', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'verify').mockImplementationOnce(async () => {
        return await new Promise((_resolve, reject) => {
          reject(new Error())
        })
      })

      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
