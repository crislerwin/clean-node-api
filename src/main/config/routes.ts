import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(join(__dirname, '../routes')).map(async (file) => {
    if (!file.endsWith('.test.ts')) {
      ;(await import(`../routes/${file}`)).default(router)
    }
  })
}
