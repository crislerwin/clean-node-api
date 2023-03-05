import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controllers: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }
    const httpResponse = await controllers.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
