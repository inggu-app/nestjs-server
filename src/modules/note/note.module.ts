import { Module } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { NoteModel } from './note.model'
import { ScheduleModule } from '../schedule/schedule.module'

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
export class NoteModule {}
