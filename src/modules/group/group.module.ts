import { forwardRef, Module } from '@nestjs/common'
import { GroupController } from './group.controller'
import { GroupService } from './group.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { FacultyModule } from '../faculty/faculty.module'
import { CallScheduleModule } from '../callSchedule/callSchedule.module'

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    forwardRef(() => FacultyModule),
    CallScheduleModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: GroupModel,
      },
    ]),
  ],
  exports: [GroupService],
})
export class GroupModule {}
