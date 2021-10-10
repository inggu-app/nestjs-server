import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupModule } from '../group/group.module'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { CallScheduleModule } from '../settings/callSchedule/callSchedule.module'
import { ResponsibleModule } from '../responsible/responsible.module'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { ScheduleRoutesMiddleware } from './schedule.middleware'

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: LessonModel,
        schemaOptions: getModelDefaultOptions('Lesson'),
      },
    ]),
    FacultyModule,
    GroupModule,
    CallScheduleModule,
    ResponsibleModule,
  ],
  exports: [ScheduleService],
})
export class ScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ScheduleRoutesMiddleware).forRoutes({ path: '/', method: RequestMethod.GET })
  }
}
