import { forwardRef, Module } from '@nestjs/common'
import { FacultyController } from './faculty.controller'
import { FacultyService } from './faculty.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { GroupModule } from '../group/group.module'
import { CallScheduleModule } from '../callSchedule/callSchedule.module'

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  imports: [
    forwardRef(() => GroupModule),
    CallScheduleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: FacultyModel,
      },
    ]),
  ],
  exports: [FacultyService],
})
export class FacultyModule {}
