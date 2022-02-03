import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AdminUserModel, Availability } from '../../modules/adminUser/adminUser.model'
import { bearerTokenRegExp } from '../regex'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { envVariables } from '../constants/envVariables.constants'
import { MongoIdString } from '../types'
import { AdminUserService } from '../../modules/adminUser/adminUser.service'
import { Types } from 'mongoose'

interface ITokenData {
  id: MongoIdString
}

export class AdminUserAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminUserService: AdminUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const bearer = context.switchToHttp().getRequest().headers.authorization as string

    if (bearer && bearerTokenRegExp.test(bearer)) {
      const token = bearer.substring(7)

      try {
        if (await this.jwtService.verifyAsync(token, { secret: this.configService.get(envVariables.jwtSecretKey) })) {
          const tokenData = this.jwtService.decode(token) as ITokenData

          const availability: keyof Availability = this.reflector.get('availability', context.getHandler())

          const adminUser = (await this.adminUserService.getById(new Types.ObjectId(tokenData.id), {
            projection: { _id: 0, availability: 1 },
          })) as Pick<AdminUserModel, 'availability'>
          if (adminUser.availability) {
            return adminUser.availability[availability]
          }
        }
      } finally {
      }
    }

    throw new ForbiddenException()
  }
}
