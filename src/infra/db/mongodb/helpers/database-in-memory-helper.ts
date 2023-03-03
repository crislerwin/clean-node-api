import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'

let inMemoryServer: MongoMemoryServer
export const setup = async (): Promise<void> => {
  inMemoryServer = await MongoMemoryServer.create()
  const uri = inMemoryServer.getUri()
  await MongoHelper.connect(uri)
}

export const teardown = async (): Promise<void> => {
  await MongoHelper.disconnect()
  await inMemoryServer.stop()
}
