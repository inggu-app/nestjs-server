import { Injectable } from '@nestjs/common'
import { CheckExistenceService } from '../../../global/classes/CheckExistenceService'
import { GroupModel } from '../group.model'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { GROUP_WITH_ID_NOT_FOUND } from '../../../global/constants/errors.constants'
import { Types } from 'mongoose'
import { mergeOptionsWithDefaultOptions } from '../../../global/utils/serviceMethodOptions'
import { FacultyService } from '../../faculty/faculty.service'
import { LearningStage } from '../../learningStage/learningStage.constants'
import { learningStageMethodDefaultOptions } from '../constants/learningStage.constants'

@Injectable()
export class LearningStageService extends CheckExistenceService<GroupModel> {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    private readonly facultyService: FacultyService
  ) {
    super(groupModel, undefined, arg => GROUP_WITH_ID_NOT_FOUND(arg._id))
  }

  async updateByFacultyId(
    facultyId: Types.ObjectId,
    learningStage: LearningStage,
    options = learningStageMethodDefaultOptions.updateByFacultyId
  ) {
    options = mergeOptionsWithDefaultOptions(options, learningStageMethodDefaultOptions.updateByFacultyId)
    if (options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: facultyId })
    return this.groupModel.updateMany({ faculty: facultyId }, { $set: { learningStage } })
  }

  updateForAllGroups(learningStage: LearningStage) {
    return this.groupModel.updateMany({}, { $set: { learningStage } })
  }
}
