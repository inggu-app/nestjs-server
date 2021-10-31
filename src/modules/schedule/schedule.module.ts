import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { GroupModule } from '../group/group.module'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { CallScheduleModule } from '../settings/callSchedule/callSchedule.module'
import { ScheduleGetRoutesMiddleware } from './scheduleGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

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
export class ScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ScheduleGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.SCHEDULE_MODULE, method: RequestMethod.GET })
  }
}
