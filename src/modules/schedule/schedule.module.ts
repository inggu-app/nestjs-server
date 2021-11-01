import { Module } from '@nestjs/common'
import { GroupModule } from '../group/group.module'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { CallScheduleModule } from '../settings/callSchedule/callSchedule.module'

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    GroupModule,
    CallScheduleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: LessonModel,
      },
    ]),
  ],
  exports: [ScheduleService],
})
export class ScheduleModule {}
