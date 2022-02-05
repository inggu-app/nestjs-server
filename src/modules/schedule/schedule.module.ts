import { Module } from '@nestjs/common'
import { GroupModule } from '../group/group.module'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { CallScheduleModule } from '../callSchedule/callSchedule.module'
import { NoteModule } from '../note/note.module'

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    GroupModule,
    CallScheduleModule,
    NoteModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: LessonModel,
      },
    ]),
  ],
  exports: [ScheduleService],
})
export class ScheduleModule {}
