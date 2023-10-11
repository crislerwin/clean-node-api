import { Controller } from '@/presentation/protocols'
import { GraphQLError } from 'graphql'

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
  const httpResponse = await controller.handle(args)
  const errorCodes: number[] = [400, 401, 403, 500]
  if (errorCodes.includes(httpResponse.statusCode)) {
    throw new GraphQLError(httpResponse.body.message, {
      extensions: { code: httpResponse.statusCode },
    })
  }
  return httpResponse.body
}
