export interface UpdateAccessTokenRepository {
  updateAccessToken: (id: any, token: string) => Promise<void>
}
