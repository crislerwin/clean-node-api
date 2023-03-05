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

  getCollection(name: string): Collection {
    const collection = this.client.db().collection(name)
    return collection
  },
  map(collection: WithId<Document> | null): any {
    if (collection) {
      const { _id, ...collectionWithoutId } = collection
      return Object.assign({}, collectionWithoutId, { id: _id })
    }
    return null
  },
}
