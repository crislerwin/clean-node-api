import { AddSurveyModel } from '@/data/usecases/db-add-survey/add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
