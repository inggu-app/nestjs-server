import { Module } from '@nestjs/common'
import { CallScheduleModule } from './callSchedule/callSchedule.module'
import { SecretLabelModule } from './secretLabel/secretLabel.module'
import { SemesterStartDateModule } from './semesterStartDate/semesterStartDate.module'
import { WeeksCountModule } from './weeksCount/weeksCount.module'
import { AppVersionModule } from './appVersion/appVersion.module'

@Module({
  imports: [
    CallScheduleModule,
    SecretLabelModule,
    SemesterStartDateModule,
    WeeksCountModule,
    AppVersionModule,
  ],
})
export class SettingsModule {}
