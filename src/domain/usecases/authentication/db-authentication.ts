import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../authentication'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, 'hashed_password')
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        return accessToken
      }
    }
    return null
  }
}
