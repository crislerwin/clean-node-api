import { MongoClient, Collection, Document, WithId } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },
  map<T>(collection: WithId<Document> | null): T {
    if (!collection) return null as T
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id }) as T
  },
}
