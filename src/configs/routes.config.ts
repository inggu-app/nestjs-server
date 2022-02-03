import { Routes } from 'nest-router'
import { ScheduleModule } from '../modules/schedule/schedule.module'
import { GroupModule } from '../modules/group/group.module'
import { FacultyModule } from '../modules/faculty/faculty.module'
import { SettingsModule } from '../modules/settings/settings.module'
import { CallScheduleModule } from '../modules/settings/callSchedule/callSchedule.module'
import { SecretLabelModule } from '../modules/settings/secretLabel/secretLabel.module'
import { SemesterRangeModule } from '../modules/settings/semesterRange/semesterRange.module'
import { AppVersionModule } from '../modules/settings/appVersion/appVersion.module'
import { NoteModule } from '../modules/note/note.module'
import { ModuleRoutesEnum } from '../global/enums/moduleRoutes.enum'

export const routesConfig: Routes = [
  {
    path: ModuleRoutesEnum.SCHEDULE_MODULE,
    module: ScheduleModule,
  },
  {
    path: ModuleRoutesEnum.GROUP_MODULE,
    module: GroupModule,
  },
  {
    path: ModuleRoutesEnum.FACULTY_MODULE,
    module: FacultyModule,
  },
  {
    path: ModuleRoutesEnum.NOTE_MODULE,
    module: NoteModule,
  },
  {
    path: ModuleRoutesEnum.SETTINGS_MODULE,
    module: SettingsModule,
    children: [
      {
        path: ModuleRoutesEnum.CALL_SCHEDULE_MODULE,
        module: CallScheduleModule,
      },
      {
        path: ModuleRoutesEnum.SECRET_LABEL_MODULE,
        module: SecretLabelModule,
      },
      {
        path: ModuleRoutesEnum.SEMESTER_RANGE_MODULE,
        module: SemesterRangeModule,
      },
      {
        path: ModuleRoutesEnum.APP_VERSION_MODULE,
        module: AppVersionModule,
      },
    ],
  },
]
