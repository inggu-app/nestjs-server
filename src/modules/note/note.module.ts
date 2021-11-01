import { Module } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypegooseModule } from 'nestjs-typegoose'
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
      },
    ]),
  ],
})
export class NoteModule {}
