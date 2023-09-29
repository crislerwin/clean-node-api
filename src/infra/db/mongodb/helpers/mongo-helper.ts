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
    return this.client.db().collection(name)
  },

  map<T extends object>(
    collection: Document | WithId<Document> | null,
    key: 'id' | 'surveyId' = 'id',
  ): T {
    if (!collection) return null as unknown as T
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { [key]: _id.toHexString() }) as T
  },

  mapCollection<T extends object>(collection: Document[]): T[] {
    return collection?.map((c) => MongoHelper.map(c)) ?? []
  },
}
