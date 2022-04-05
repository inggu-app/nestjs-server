import { Injectable } from '@nestjs/common'
import { CheckExistenceService } from '../../../global/classes/CheckExistenceService'
import { CallScheduleItemModel, GroupModel } from '../group.model'
import { GROUP_WITH_ID_NOT_FOUND } from '../../../global/constants/errors.constants'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { callScheduleMethodDefaultOptions } from '../constants/callSchedule.constants'
import { mergeOptionsWithDefaultOptions } from '../../../global/utils/serviceMethodOptions'
import { FacultyService } from '../../faculty/faculty.service'
import { InjectModel } from 'nestjs-typegoose'

@Injectable()
export class CallScheduleService extends CheckExistenceService<GroupModel> {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    private readonly facultyService: FacultyService
  ) {
    super(groupModel, undefined, arg => GROUP_WITH_ID_NOT_FOUND(arg._id))
  }

  async updateByFacultyId(
    facultyId: Types.ObjectId,
    callSchedule: CallScheduleItemModel[],
    options = callScheduleMethodDefaultOptions.updateByFacultyId
  ) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleMethodDefaultOptions.updateByFacultyId)
    if (options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: facultyId })
    return this.groupModel.updateMany({ faculty: facultyId }, { $set: { callSchedule } })
  }
}
