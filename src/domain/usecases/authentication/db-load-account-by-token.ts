import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByToken } from '../load-account-by-token'
import { AccountModel } from './db-authentication-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter, private readonly role?: string) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    // @ts-expect-error
    return null
  }
}
