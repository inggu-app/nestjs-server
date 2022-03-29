import { ApiProperty } from '@nestjs/swagger'
import { AppVersionModuleResponseAppVersion } from './AppVersionModuleGetVersionResponse.dto'

export class AppVersionModuleGetFromVersionResponseDto {
  @ApiProperty({
    type: AppVersionModuleResponseAppVersion,
    isArray: true,
  })
  versions: AppVersionModuleResponseAppVersion[]
}
