import { MongoHelper } from '../../../../infra/db/mongodb/helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const InMemoryMongoDbHelper = {
  inMemoryServer: null as unknown as MongoMemoryServer,
  async setup(): Promise<void> {
    this.inMemoryServer = await MongoMemoryServer.create()
    const uri = this.inMemoryServer.getUri()
    await MongoHelper.connect(uri)
  },
  async teardown(): Promise<void> {
    await MongoHelper.disconnect()
    await this.inMemoryServer.stop()
  },
}
