export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
      example: 'Qual sua linguagem preferida?',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer',
      },
      example: [
        {
          image: 'https://i.imgur.com/JR7XzfQ.png',
          answer: 'JavaScript',
        },
      ],
    },
  },
  required: ['question', 'answers'],
}
