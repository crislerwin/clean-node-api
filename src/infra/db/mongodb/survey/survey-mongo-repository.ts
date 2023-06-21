import { AddSurveyModel } from '@/data/usecases/db-add-survey/add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return JSON.parse(JSON.stringify(surveys))
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return (await surveyCollection.findOne({
      _id: new ObjectId(id),
    })) as unknown as SurveyModel
  }
}
