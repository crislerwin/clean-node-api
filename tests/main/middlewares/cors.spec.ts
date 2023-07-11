import request from 'supertest'
import { setupApp } from '@/main/config/app'
import { describe, test } from 'vitest'

describe('Cors Middleware', async () => {
  const app = await setupApp()
  test('Should enable Cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).get('/test_cors').expect('access-control-allow-origin', '*')
    await request(app).get('/test_cors').expect('access-control-allow-methods', '*')
    await request(app).get('/test_cors').expect('access-control-allow-headers', '*')
  })
})
