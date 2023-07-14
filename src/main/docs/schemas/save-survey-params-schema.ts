export const saveSurveyParamsSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string',
      example: 'any_answer',
    },
  },
  required: ['answer'],
}
