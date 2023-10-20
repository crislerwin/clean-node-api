import { Controller } from '@/presentation/protocols'
import { GraphQLError } from 'graphql'

export const adaptResolver = async (
  controller: Controller,
  args: any,
  context?: any,
): Promise<any> => {
  const request = {
    ...(args || {}),
    accountId: context?.req?.accountId,
  }
  const httpResponse = await controller.handle(request)
  const errorCodes: number[] = [400, 401, 403, 500]
  if (errorCodes.includes(httpResponse.statusCode)) {
    throw new GraphQLError(httpResponse.body.message, {
      extensions: { code: httpResponse.statusCode },
    })
  }
  return httpResponse.body
}
