export default {
  mongoUrl: process.env.VITE_MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.VITE_PORT ?? 5050,
  jwtSecret: process.env.VITE_JWT_SECRET ?? 'n3t0n=4H4',
}
