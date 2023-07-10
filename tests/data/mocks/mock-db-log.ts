import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      await new Promise((resolve) => {
        resolve(null)
      })
    }
  }
  return new LogErrorRepositoryStub()
}
