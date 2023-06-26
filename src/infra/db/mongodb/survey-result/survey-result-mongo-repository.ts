import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SaveSurveyResultModel, SurveyResultModel } from '@/domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoResultRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const { value } = await surveyCollection.findOneAndUpdate(
      {
        _id: new ObjectId(data.surveyId),
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
      },
    )
    return MongoHelper.map<SurveyResultModel>(value)
  }
}
