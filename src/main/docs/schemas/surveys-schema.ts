export const surveysSchema = {
  type: 'array',

  items: {
    $ref: '#/schemas/survey',
  },
  example: [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
    },
  ],
}
