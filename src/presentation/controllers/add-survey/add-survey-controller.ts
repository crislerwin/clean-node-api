import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './add-survey-controller-protocols'
export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(request: HttpRequest): Promise<HttpResponse | null> {
    this.validation.validate(request.body)
    return await new Promise((resolve) => {
      resolve(null)
    })
  }
}
