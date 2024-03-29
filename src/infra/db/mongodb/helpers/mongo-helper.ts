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
  map<T extends object>(collection: WithId<Document> | null): T {
    if (!collection) return null as unknown as T
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id.toHexString() }) as T
  },

  mapSurvey<T extends object>(collection: WithId<Document> | null): T {
    if (!collection) return null as unknown as T
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { surveyId: _id.toHexString() }) as T
  },

  mapCollection<T extends object>(collection: any[]): T[] {
    return collection?.map((c) => MongoHelper.map(c)) ?? []
  },
}
