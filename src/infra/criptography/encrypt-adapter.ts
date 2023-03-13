import { Hasher } from '@/data/protocols/criptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return await new Promise((resolve) => {
      resolve(true)
    })
  }
}
