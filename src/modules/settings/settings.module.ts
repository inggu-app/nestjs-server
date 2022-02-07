import { Module } from '@nestjs/common'
import { SecretLabelModule } from './secretLabel/secretLabel.module'
import { SemesterRangeModule } from './semesterRange/semesterRange.module'

@Module({
  imports: [SecretLabelModule, SemesterRangeModule],
})
export class SettingsModule {}
