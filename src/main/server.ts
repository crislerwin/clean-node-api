import app from './config/app'

const APP_PORT = process.env.NODE_PORT ?? 5050

app.get('/', (req, res) => {
  res.send({
    message: process.env.NODE_PORT,
  })
})

app.listen(APP_PORT, () => {
  console.log(`Server running at http://localhost:${APP_PORT}`)
})
