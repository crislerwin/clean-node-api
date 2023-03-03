import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(): Promise<void> {
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    this.client = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },
}
