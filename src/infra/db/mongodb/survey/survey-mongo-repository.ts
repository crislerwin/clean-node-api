import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { ObjectId } from 'mongodb'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { QueryBuilder } from '../query-builder'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    LoadAnswersBySurveyRepository
{
  async add(data: AddSurvey.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const result = await surveyCollection.findOne({
      _id: new ObjectId(id),
    })

    return await MongoHelper.mapSurvey(result)
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id),
      })
      .project({
        _id: 0,
        answers: '$answers.answer',
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys[0]?.answers || []
  }
}
