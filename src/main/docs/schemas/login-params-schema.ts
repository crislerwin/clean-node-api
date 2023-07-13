export const loginParamsSchema = {
  properties: {
    email: {
      type: 'string',
      example: 'crislerwintler@gmail.com',
    },
    password: { type: 'string', example: '123456' },
  },
  required: ['email', 'password'],
}
