import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { NoteModel } from './note.model'
import { ScheduleModule } from '../schedule/schedule.module'
import { NoteRoutesMiddleware } from './note.middleware'

@Module({
  providers: [NoteService],
  controllers: [NoteController],
  imports: [
    ScheduleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: NoteModel,
        schemaOptions: getModelDefaultOptions('Note'),
      },
    ]),
  ],
})
export class NoteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NoteRoutesMiddleware).forRoutes({ path: '/', method: RequestMethod.GET })
  }
}
