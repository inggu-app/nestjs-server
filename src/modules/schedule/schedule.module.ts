import { Module } from '@nestjs/common'
import { FacultyModule } from '../faculty/faculty.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [FacultyModule, GroupModule],
})
export class ScheduleModule {}
