import { Module } from '@nestjs/common'
import { CallScheduleModule } from './callSchedule/callSchedule.module'
import { SecretLabelModule } from './secretLabel/secretLabel.module'
import { SemesterRangeDateModule } from './semesterRangeDate/semesterRangeDate.module'
import { WeeksCountModule } from './weeksCount/weeksCount.module'
import { AppVersionModule } from './appVersion/appVersion.module'

@Module({
  imports: [CallScheduleModule, SecretLabelModule, SemesterRangeDateModule, WeeksCountModule, AppVersionModule],
})
export class SettingsModule {}
