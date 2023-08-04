import { faker } from '@faker-js/faker'
import { Hasher } from '../protocols/criptography'

export class HasherSpy implements Hasher {
  digest = faker.string.uuid()
  plaintext!: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}
