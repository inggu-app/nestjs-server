import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { Credentials } from '../../modules/admin/dto/createAdmin.dto'
import { OWNER_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class OwnerJwtStrategy extends PassportStrategy(Strategy, OWNER_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    })
  }

  async validate(accessTokenData: Credentials) {
    const ownerLogin = this.configService.get('OWNER_LOGIN')
    const ownerPassword = this.configService.get('OWNER_PASSWORD')

    if (ownerLogin && ownerPassword) {
      const isValidLogin = await bcrypt.compare(ownerLogin, accessTokenData.login)
      const isValidPassword = await bcrypt.compare(ownerPassword, accessTokenData.password)

      if (isValidLogin && isValidPassword) {
        return true
      }
    }

    throw new ForbiddenException()
  }
}
