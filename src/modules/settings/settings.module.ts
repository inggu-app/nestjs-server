import { Module } from '@nestjs/common'
import { SecretLabelModule } from './secretLabel/secretLabel.module'
import { SemesterRangeModule } from './semesterRange/semesterRange.module'
import { AppVersionModule } from './appVersion/appVersion.module'

@Module({
  imports: [SecretLabelModule, SemesterRangeModule, AppVersionModule],
})
export class SettingsModule {}
