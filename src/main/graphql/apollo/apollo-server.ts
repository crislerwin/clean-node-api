import { ApolloServer } from '@apollo/server'

export const server = new ApolloServer({
  typeDefs,
  resolvers,
})
