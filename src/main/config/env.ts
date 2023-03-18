export default {
  mongoUrl:
    process.env.VITE_MONGO_URL ??
    'mongodb+srv://crislerwintler:MEgvC9iMC3kdsFGn@cluster0.mr1p445.mongodb.net/?retryWrites=true&w=majority',
  port: process.env.VITE_PORT ?? 8080,
  jwtSecret: process.env.VITE_JWT_SECRET ?? 'n3t0n=4H4',
}
