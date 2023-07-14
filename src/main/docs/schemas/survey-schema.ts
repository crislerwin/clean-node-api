export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: 'c3c8c7c4-8c2f-4f4f-b8c7-8d3c8c7c8c8c',
    },
    question: {
      type: 'string',
      example: 'Question example',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer',
      },
      example: [
        {
          image: 'image_url',
          answer: 'Answer example',
        },
      ],
    },
    date: {
      type: 'string',
      format: 'date-time',
      example: '2021-12-20T00:00:00.000Z',
    },
  },
  required: ['id', 'question', 'answers', 'date'],
}
