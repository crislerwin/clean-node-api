export const resolvers = {
  Query: {
    login() {
      return {
        accessToken: 'any token',
        name: 'any name',
      }
    },
  },
}
