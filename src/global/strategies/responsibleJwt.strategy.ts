import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { ICreateScheduleDto } from '../../modules/schedule/dto/create-schedule.dto'
import { ResponsibleAccessTokenData } from '../../modules/responsible/responsible.service'
import { RESPONSIBLE_STRATEGY_NAME } from '../constants/strategies.constants'

@Injectable()
export class ResponsibleJwtStrategy extends PassportStrategy(Strategy, RESPONSIBLE_STRATEGY_NAME) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: true,
    })
  }

  async validate(
    request: Request<any, any, ICreateScheduleDto>,
    token: ResponsibleAccessTokenData
  ) {
    if (!token.groups.includes(request.body.group)) {
      throw new ForbiddenException()
    }

    return true
  }
}
