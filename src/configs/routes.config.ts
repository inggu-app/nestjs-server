import { Routes } from 'nest-router'
import { ScheduleModule } from '../modules/schedule/schedule.module'
import { GroupModule } from '../modules/group/group.module'
import { FacultyModule } from '../modules/faculty/faculty.module'
import { SettingsModule } from '../modules/settings/settings.module'
import { CallScheduleModule } from '../modules/callSchedule/callSchedule.module'
import { SecretLabelModule } from '../modules/settings/secretLabel/secretLabel.module'
import { SemesterRangeModule } from '../modules/settings/semesterRange/semesterRange.module'
import { NoteModule } from '../modules/note/note.module'
import { ModuleRoutesEnum } from '../global/enums/moduleRoutes.enum'
import { AdminUserModule } from '../modules/adminUser/adminUser.module'
import { AppVersionModule } from '../modules/appVersion/appVersion.module'
import { LearningStageModule } from '../modules/learningStage/learningStage.module'

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
    path: ModuleRoutesEnum.ADMIN_USER_MODULE,
    module: AdminUserModule,
  },
  {
    path: ModuleRoutesEnum.CALL_SCHEDULE_MODULE,
    module: CallScheduleModule,
  },
  {
    path: ModuleRoutesEnum.APP_VERSION_MODULE,
    module: AppVersionModule,
  },
  {
    path: ModuleRoutesEnum.LEARNING_STAGE_MODULE,
    module: LearningStageModule,
  },
  {
    path: ModuleRoutesEnum.SETTINGS_MODULE,
    module: SettingsModule,
    children: [
      {
        path: ModuleRoutesEnum.SECRET_LABEL_MODULE,
        module: SecretLabelModule,
      },
      {
        path: ModuleRoutesEnum.SEMESTER_RANGE_MODULE,
        module: SemesterRangeModule,
      },
    ],
  },
]
