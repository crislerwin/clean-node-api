import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { Express } from 'express'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http'
import { json } from 'body-parser'
import typeDefs from '../typedefs'
import { resolvers } from '../resolvers'
import { GraphQLError } from 'graphql'

const errorMap: Record<string, number> = {
  Unauthorized: 401,
  ServerError: 500,
  BadRequest: 400,
  AccessDenied: 401,
  InvalidParam: 401,
}

const handleErrors = (response: any, errors?: readonly GraphQLError[] | undefined): void => {
  errors?.forEach((error) => {
    response.data = undefined
    response.http.status = errorMap?.[error.message] ?? 500
  })
}

export default async (app: Express): Promise<void> => {
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) => handleErrors(response, errors),
        }),
      },
    ],
  })
  await server.start()
  app.use('/graphql', json(), expressMiddleware(server))
}
