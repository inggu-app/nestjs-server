import { forwardRef, Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CallScheduleController } from './callSchedule.controller'
import { CallScheduleService } from './callSchedule.service'
import { CallScheduleModel } from './callSchedule.model'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupModule } from '../group/group.module'

@Module({
  controllers: [CallScheduleController],
  providers: [CallScheduleService],
  imports: [
    forwardRef(() => FacultyModule),
    forwardRef(() => GroupModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: CallScheduleModel,
      },
    ]),
  ],
  exports: [CallScheduleService],
})
export class CallScheduleModule {}
