import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { ICreateScheduleDto } from '../../modules/schedule/dto/create-schedule.dto'
import { AccessTokenData } from '../../modules/responsible/responsible.service'
import { ADMIN_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, ADMIN_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request<any, any, ICreateScheduleDto>, token: AccessTokenData) {
    if (!token.groups.includes(request.body.group)) {
      throw new ForbiddenException()
    }

    return true
  }
}
