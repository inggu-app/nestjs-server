import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { ICreateScheduleDto } from '../../modules/schedule/dto/createSchedule.dto'
import { ResponsibleAccessTokenData, ResponsibleService } from '../../modules/responsible/responsible.service'
import { RESPONSIBLE_STRATEGY_NAME } from '../constants/strategies.constants'
import { checkJwtType, responsibleExampleAccessTokenData } from '../utils/checkJwtType'
import { isMongoId } from 'class-validator'
import { INVALID_MONGO_ID } from '../constants/errors.constants'
import { GroupService } from '../../modules/group/group.service'

@Injectable()
export class ResponsibleJwtStrategy extends PassportStrategy(Strategy, RESPONSIBLE_STRATEGY_NAME) {
  constructor(
    private readonly configService: ConfigService,
    private readonly groupService: GroupService,
    private readonly responsibleService: ResponsibleService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: true,
    })
  }

  async validate(request: Request<any, any, ICreateScheduleDto>, accessTokenData: ResponsibleAccessTokenData) {
    if (!isMongoId(request.body.group)) {
      throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST)
    }

    const responsible = await this.responsibleService.getById(accessTokenData.id)

    checkJwtType(accessTokenData, responsibleExampleAccessTokenData)

    if (responsible.groups.includes(request.body.group)) return true

    if (responsible.forbiddenGroups.includes(request.body.group)) throw new ForbiddenException()

    if (
      await this.groupService.checkExists(
        {
          _id: request.body.group,
          faculty: { $in: responsible.faculties },
        },
        new ForbiddenException()
      )
    )
      return true

    throw new ForbiddenException()
  }
}
