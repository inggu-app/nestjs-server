import { Routes } from 'nest-router'
import { ScheduleModule } from '../modules/schedule/schedule.module'
import { GroupModule } from '../modules/group/group.module'
import { FacultyModule } from '../modules/faculty/faculty.module'
import { SettingsModule } from '../modules/settings/settings.module'
import { CallScheduleModule } from '../modules/settings/callSchedule/callSchedule.module'
import { SecretLabelModule } from '../modules/settings/secretLabel/secretLabel.module'
import { SemesterRangeDateModule } from '../modules/settings/semesterRangeDate/semesterRangeDate.module'
import { AppVersionModule } from '../modules/settings/appVersion/appVersion.module'
import { NoteModule } from '../modules/note/note.module'
import { UserModule } from '../modules/user/user.module'
import { FunctionalityModule } from '../modules/functionality/functionality.module'
import { RoleModule } from '../modules/role/role.module'
import { ModuleRoutesEnum } from '../global/enums/moduleRoutes.enum'
import { InterfaceModule } from '../modules/interface/interface.module'
import { ViewModule } from '../modules/view/view.module'

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
    path: ModuleRoutesEnum.USER_MODULE,
    module: UserModule,
  },
  {
    path: ModuleRoutesEnum.ROLE_MODULE,
    module: RoleModule,
  },
  {
    path: ModuleRoutesEnum.FUNCTIONALITY_MODULE,
    module: FunctionalityModule,
  },
  {
    path: ModuleRoutesEnum.INTERFACE_MODULE,
    module: InterfaceModule,
  },
  {
    path: ModuleRoutesEnum.VIEW_MODULE,
    module: ViewModule,
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
        path: ModuleRoutesEnum.SEMESTER_START_DATE_MODULE,
        module: SemesterRangeDateModule,
      },
      {
        path: ModuleRoutesEnum.APP_VERSION_MODULE,
        module: AppVersionModule,
      },
    ],
  },
]
