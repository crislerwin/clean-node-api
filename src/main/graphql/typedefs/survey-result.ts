export default `#graphql
    extend type Query {
        surveyResult (surveyId: String!): SurveyResult! @auth
    }

    extend type Mutation {
        saveSurveyResult (surveyId: String!, answer: String!): SurveyResult! @auth
    }

    type SurveyResult {
        surveyId: String!
        question: String!
        answers: [Answer!]!
    }

    type Answer {
        image: String
        answer: String!
        count: Int!
        percent: Int!
        isCurrentAccountAnswer: Boolean!
    }

`
