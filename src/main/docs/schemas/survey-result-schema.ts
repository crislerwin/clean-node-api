export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string',
      example: 'any_id',
    },
    question: {
      type: 'string',
      example: 'any_question',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer',
      },
      example: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
    },
    date: {
      type: 'string',
      example: 'any_date',
    },
  },
  required: ['surveyId', 'question', 'answers', 'date'],
}
