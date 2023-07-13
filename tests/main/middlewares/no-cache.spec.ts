import request from 'supertest'
import { setupApp } from '@/main/config/app'
import { describe, test } from 'vitest'
import { noChache } from '@/main/middlewares/no-cache'

describe('No cache Middleware', async () => {
  const app = await setupApp()
  test('Should disable cache', async () => {
    app.get('/test_no_cache', noChache, (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_no_cache')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
