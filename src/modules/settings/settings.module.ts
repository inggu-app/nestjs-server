import { Module } from '@nestjs/common'
import { CallScheduleModule } from './callSchedule/callSchedule.module'
import { SecretLabelModule } from './secretLabel/secretLabel.module'
import { SemesterRangeModule } from './semesterRange/semesterRange.module'
import { AppVersionModule } from './appVersion/appVersion.module'

@Module({
  imports: [CallScheduleModule, SecretLabelModule, SemesterRangeModule, AppVersionModule],
})
export class SettingsModule {}
