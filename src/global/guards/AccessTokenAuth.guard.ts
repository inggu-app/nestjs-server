import { ITokenData } from '../types'
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { envVariables } from '../constants/envVariables.constants'
import { Types } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AdminUserService } from '../../modules/adminUser/adminUser.service'

export interface IAccessTokenAuth {
  accessAllowed(tokenData: ITokenData, context: ExecutionContext): boolean | Promise<boolean>
}

export class AccessTokenAuthGuard implements CanActivate, IAccessTokenAuth {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly adminUserService: AdminUserService
  ) {}

  accessAllowed(tokenData: ITokenData, context: ExecutionContext): boolean | Promise<boolean> {
    return true
  }

  async canActivate(context: ExecutionContext) {
    const token = context.switchToHttp().getRequest().cookies['access_token']

    if (token) {
      try {
        if (await this.jwtService.verifyAsync(token, { secret: this.configService.get(envVariables.tokenJwtSecretKey) })) {
          const tokenData = this.jwtService.decode(token) as ITokenData
          if (await this.adminUserService.checkTokenExists(Types.ObjectId(tokenData.id), token)) {
            return this.accessAllowed(tokenData, context)
          }
        }
      } finally {
      }
    }

    throw new ForbiddenException()
  }
}
