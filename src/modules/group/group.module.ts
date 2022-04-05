import { forwardRef, Module } from '@nestjs/common'
import { GroupController } from './controllers/group.controller'
import { GroupService } from './services/group.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { FacultyModule } from '../faculty/faculty.module'
import { ScheduleModule } from '../schedule/schedule.module'
import { CallScheduleService } from './services/callSchedule.service'
import { CallScheduleController } from './controllers/callSchedule.controller'
import { LearningStageController } from './controllers/learningStage.controller'
import { LearningStageService } from './services/learningStage.service'

@Module({
  controllers: [GroupController, CallScheduleController, LearningStageController],
  providers: [GroupService, CallScheduleService, LearningStageService],
  imports: [
    forwardRef(() => FacultyModule),
    forwardRef(() => ScheduleModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: GroupModel,
      },
    ]),
  ],
  exports: [GroupService],
})
export class GroupModule {}
