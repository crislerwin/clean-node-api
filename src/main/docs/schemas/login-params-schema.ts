export const loginParamsSchema = {
  properties: {
    email: {
      type: 'string',
      example: 'johndoe@email.com',
    },
    password: { type: 'string', example: '123456' },
  },
  required: ['email', 'password'],
}
