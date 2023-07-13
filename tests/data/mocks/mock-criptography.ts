import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols/criptography'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }

    async compare(value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  const encrypterStub = new HasherStub()
  return encrypterStub
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}
