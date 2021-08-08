import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export default function getJWTConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.get('JWT_SECRET_KEY'),
    signOptions: { expiresIn: '20d' },
  }
}
