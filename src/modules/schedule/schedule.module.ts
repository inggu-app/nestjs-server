import { forwardRef, Module } from '@nestjs/common'
import { FacultyModule } from '../faculty/faculty.module'
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
    TypegooseModule.forFeature([
      {
        typegooseClass: LessonModel,
        schemaOptions: {
          collection: 'Lesson',
        },
      },
    ]),
    FacultyModule,
    GroupModule,
    CallScheduleModule,
  ],
})
export class ScheduleModule {}
