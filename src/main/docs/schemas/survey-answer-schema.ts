export const surveyAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      example: 'any_image.jpg',
    },
    answer: {
      type: 'string',
      example: 'any_answer',
    },
  },
  required: ['answer'],
}
