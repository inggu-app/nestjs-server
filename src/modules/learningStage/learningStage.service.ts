import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { LearningStageModel } from './learningStage.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { CreateLearningStageDto } from './dto/createLearningStage.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateLearningStageDto } from './dto/updateLearningStage.dto'
import {
  LEARNING_STAGE_BY_DATE_NOT_FOUND,
  LEARNING_STAGE_INTERVALS_COLLISION,
  LEARNING_STAGE_WITH_ID_NOT_FOUND,
} from '../../global/constants/errors.constants'

@Injectable()
export class LearningStageService extends CheckExistenceService<LearningStageModel> {
  constructor(@InjectModel(LearningStageModel) private readonly learningStageModel: ModelType<LearningStageModel>) {
    super(learningStageModel, undefined, learningStage => LEARNING_STAGE_WITH_ID_NOT_FOUND(learningStage._id))
  }

  async create(dto: CreateLearningStageDto) {
    await this.throwIfExists(
      { $or: [{ start: { $gte: dto.start, $lte: dto.end } }, { end: { $gte: dto.start, $lte: dto.end } }] },
      { error: LEARNING_STAGE_INTERVALS_COLLISION }
    )
    return this.learningStageModel.create(dto)
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: id })
    return this.learningStageModel.findOne({ _id: id }, undefined, queryOptions)
  }

  async getByDate(date: Date, queryOptions?: QueryOptions) {
    console.log(date)
    await this.throwIfNotExists({ start: { $lte: date }, end: { $gte: date } }, { error: LEARNING_STAGE_BY_DATE_NOT_FOUND(date) })

    return this.learningStageModel.findOne({ start: { $lte: date }, end: { $gte: date } }, undefined, queryOptions)
  }

  getCurrentAndFuture(queryOptions?: QueryOptions) {
    const currentDate = new Date()
    return this.learningStageModel.find({ end: { $gte: currentDate } }, undefined, queryOptions)
  }

  async update(dto: UpdateLearningStageDto) {
    const { id, ...fields } = dto
    await this.throwIfNotExists({ _id: id })
    return this.learningStageModel.updateOne({ _id: id }, { $set: fields })
  }

  async delete(id: Types.ObjectId) {
    await this.throwIfNotExists({ _id: id })
    return this.learningStageModel.deleteOne({ _id: id })
  }
}
