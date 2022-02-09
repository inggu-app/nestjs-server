import { Module } from '@nestjs/common'
import { SecretLabelModule } from './secretLabel/secretLabel.module'

@Module({
  imports: [SecretLabelModule],
})
export class SettingsModule {}
