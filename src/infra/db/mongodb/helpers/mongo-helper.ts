import { MongoClient, Collection, Document, WithId, ObjectId } from 'mongodb'

type MappedCollection = Record<string, any> & {
  id: ObjectId
}
export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  },
  async getCollection(name: string): Promise<Collection<Document>> {
    const collection = this.client.db().collection(name)
    return collection
  },
  map(collection: WithId<Document> | null): MappedCollection | null {
    if (collection) {
      const { _id, ...collectionWithoutId } = collection
      return Object.assign({}, collectionWithoutId, { id: _id })
    }
    return null
  },
}
