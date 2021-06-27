import { Routes } from 'nest-router'
import { ScheduleModule } from '../modules/schedule/schedule.module'
import { GroupModule } from '../modules/group/group.module'
import { FacultyModule } from '../modules/faculty/faculty.module'
import { SettingsModule } from '../modules/settings/settings.module'
import { CallScheduleModule } from '../modules/settings/callSchedule/callSchedule.module'
import { SecretLabelModule } from '../modules/settings/secretLabel/secretLabel.module'
import { SemesterStartDateModule } from '../modules/settings/semesterStartDate/semesterStartDate.module'
import { WeeksCountModule } from '../modules/settings/weeksCount/weeksCount.module'
import { AppVersionModule } from '../modules/settings/appVersion/appVersion.module'

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
  {
    path: '/settings',
    module: SettingsModule,
    children: [
      {
        path: '/call-schedule',
        module: CallScheduleModule,
      },
      {
        path: '/secret-label',
        module: SecretLabelModule,
      },
      {
        path: '/semester-start-date',
        module: SemesterStartDateModule,
      },
      {
        path: '/weeks-count',
        module: WeeksCountModule,
      },
      {
        path: '/app-version',
        module: AppVersionModule,
      },
    ],
  },
]
