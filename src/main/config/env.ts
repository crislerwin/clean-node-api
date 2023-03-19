export default {
  mongoUrl:
    process.env.MONGO_URL ??
    'mongodb+srv://crislerwintler:MOupi7WkXg1Abxxe@cluster0.mr1p445.mongodb.net/?retryWrites=true&w=majority',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'n3t0n=4H4',
}
