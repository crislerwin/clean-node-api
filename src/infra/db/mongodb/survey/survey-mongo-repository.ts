import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { ObjectId } from 'mongodb'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const { question, answers } = surveyData
    await surveyCollection.insertOne({
      question,
      answers,
      date: new Date(),
    })
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return MongoHelper.map<SurveyModel>(survey)
  }
}
