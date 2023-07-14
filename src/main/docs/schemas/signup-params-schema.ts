export const signUpParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      example: '123456',
    },
    passwordConfirmation: {
      type: 'string',
      example: '123456',
    },
  },
  required: ['name', 'email', 'password', 'passwordConfirmation'],
}
