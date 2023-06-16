import {
  LoadAccountByToken,
  Decrypter,
  AccountModel,
  LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    if (token) return account
    return null
  }
}
