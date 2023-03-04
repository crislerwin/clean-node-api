import { Request, Response } from 'express'
import app from './config/app'

const APP_PORT = process.env.NODE_PORT ?? 5050

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Hello World!',
  })
})

app.listen(APP_PORT, () => {
  console.log(`Server running at http://localhost:${APP_PORT}`)
})
