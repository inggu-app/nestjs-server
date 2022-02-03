import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import { envVariables } from '../global/constants/envVariables.constants'

export default function getJWTConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.get(envVariables.tokenJwtSecretKey),
    signOptions: { expiresIn: '20d' },
  }
}
