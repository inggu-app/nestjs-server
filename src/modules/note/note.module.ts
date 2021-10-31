import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ScheduleModule } from '../schedule/schedule.module'
import { NoteGetRoutesMiddleware } from './noteGetRoutes.middleware'
import { ModuleRoutesEnum } from '../../global/enums/moduleRoutes.enum'

@Module({
  providers: [NoteService],
  controllers: [NoteController],
  imports: [
    ScheduleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: NoteModel,
      },
    ]),
  ],
})
export class NoteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NoteGetRoutesMiddleware).forRoutes({ path: ModuleRoutesEnum.NOTE_MODULE, method: RequestMethod.GET })
  }
}
