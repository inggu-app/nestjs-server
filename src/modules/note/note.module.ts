import { forwardRef, Module } from '@nestjs/common'
import { NoteService } from './note.service'
import { NoteController } from './note.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ScheduleModule } from '../schedule/schedule.module'

@Module({
  providers: [NoteService],
  controllers: [NoteController],
  imports: [
    forwardRef(() => ScheduleModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: NoteModel,
      },
    ]),
  ],
  exports: [NoteService],
})
export class NoteModule {}
