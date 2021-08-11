import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { ADMIN_STRATEGY_NAME } from '../constants/strategies.constants'
import { AdminAccessTokenData } from '../../modules/admin/admin.service'
import { adminExampleAccessTokenData, checkJwtType } from '../utils/checkJwtType'

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, ADMIN_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    })
  }

  async validate(accessTokenData: AdminAccessTokenData) {
    checkJwtType(accessTokenData, adminExampleAccessTokenData)
    if (accessTokenData.type === 'ADMIN') {
      return true
    }

    throw new ForbiddenException()
  }
}
