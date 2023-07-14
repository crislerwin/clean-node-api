export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      example: 'https://image.com',
    },
    answer: {
      type: 'string',
      example: 'any_answer',
    },
  },
  required: ['answer'],
}
