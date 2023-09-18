export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    question: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer',
      },
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
    didAnswer: {
      type: 'boolean',
    },
  },
  required: ['id', 'question', 'answers', 'date', 'didAnswer'],
}
