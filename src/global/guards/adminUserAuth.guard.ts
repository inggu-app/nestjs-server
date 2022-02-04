import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AdminUserModel, Availability } from '../../modules/adminUser/adminUser.model'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { envVariables } from '../constants/envVariables.constants'
import { MongoIdString } from '../types'
import { AdminUserService } from '../../modules/adminUser/adminUser.service'
import { Types } from 'mongoose'

export interface ITokenData {
  id: MongoIdString
}

@Injectable()
export class AdminUserAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminUserService: AdminUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest().cookies['access_token']

    if (token) {
      try {
        if (await this.jwtService.verifyAsync(token, { secret: this.configService.get(envVariables.tokenJwtSecretKey) })) {
          const tokenData = this.jwtService.decode(token) as ITokenData
          if (await this.adminUserService.checkTokenExists(Types.ObjectId(tokenData.id), token)) {
            const adminUser = (await this.adminUserService.getById(new Types.ObjectId(tokenData.id), {
              projection: { _id: 0, availability: 1 },
            })) as Pick<AdminUserModel, 'availability'>

            const availability: keyof Availability = this.reflector.get('availability', context.getHandler())
            if (adminUser.availability) {
              return adminUser.availability[availability]
            }
          }
        }
      } finally {
      }
    }

    throw new ForbiddenException()
  }
}
