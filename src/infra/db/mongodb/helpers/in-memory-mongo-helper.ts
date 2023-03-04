import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { beforeAll, afterAll } from 'vitest'

export const InMemoryMongoDbHelper = {
  inMemoryServer: null as unknown as MongoMemoryServer,
  async setup(): Promise<void> {
    beforeAll(async () => {
      this.inMemoryServer = await MongoMemoryServer.create()
      const uri = this.inMemoryServer.getUri()
      await MongoHelper.connect(uri)
    })
  },
  async teardown(): Promise<void> {
    afterAll(async () => {
      await MongoHelper.disconnect()
      await this.inMemoryServer.stop()
    })
  },
}
