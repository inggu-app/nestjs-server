import { Routes } from 'nest-router'
import { ScheduleModule } from '../modules/schedule/schedule.module'
import { GroupModule } from '../modules/group/group.module'
import { FacultyModule } from '../modules/faculty/faculty.module'

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
