import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { describe, expect, test, vi } from 'vitest'
import { AuthenticationModel } from '../authentication'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password',
})
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount())
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => {
        resolve(true)
      })
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('any_token')
      })
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      await new Promise((resolve) => {
        resolve('any_token')
      })
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  }
}
const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

describe('DbAuthentication Usecase', () => {
  test('Should  call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      null as unknown as Promise<AccountModel>,
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = vi.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('Should  throw if LoadAccountByEmailRepository throws', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashCompare returns false', async () => {
    const { hashCompareStub, sut } = makeSut()
    vi.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(false)
      }),
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = vi.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should  throw if TokenGenerator throws', async () => {
    const { tokenGeneratorStub, sut } = makeSut()
    vi.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessTokeRepository  with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = vi.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('Should  throw if UpdateAccessTokeRepository throws', async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut()
    vi.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
