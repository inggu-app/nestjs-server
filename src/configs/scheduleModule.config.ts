import { Routes } from 'nest-router'
import { ScheduleModule } from '../schedule/schedule.module'
import { GroupModule } from '../group/group.module'
import { FacultyModule } from '../faculty/faculty.module'

export const scheduleModuleConfig: Routes = [
  {
    path: '/schedule',
    module: ScheduleModule,
    children: [
      {
        path: '/group',
        module: GroupModule,
      },
      {
        path: '/faculty',
        module: FacultyModule,
      },
    ],
  },
]
