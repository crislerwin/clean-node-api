import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SaveSurveyResultParams } from '@/domain/models/survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await (
      await surveyResultCollection
    ).findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
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
  }
}
