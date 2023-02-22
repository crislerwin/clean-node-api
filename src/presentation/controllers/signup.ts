export class SignupController {
  handle(httpRequest: any): any {
    if (httpRequest.body.name === undefined) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      }
    }
    if (httpRequest.body.email === undefined) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      }
    }
  }
}
