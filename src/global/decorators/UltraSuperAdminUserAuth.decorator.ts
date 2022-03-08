import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common'
import { Types } from 'mongoose'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AdminUserService } from '../../modules/adminUser/adminUser.service'
import { ITokenData } from '../types'
import { AccessTokenAuthGuard, IAccessTokenAuth } from '../guards/AccessTokenAuth.guard'
import { TokenDataModel } from '../../modules/adminUser/adminUser.model'

export const UltraSuperAdminUserAuth = () => {
  return UseGuards(UltraSuperAdminUserAuthGuard)
}

@Injectable()
class UltraSuperAdminUserAuthGuard extends AccessTokenAuthGuard implements IAccessTokenAuth {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly adminUserService: AdminUserService
  ) {
    super(jwtService, configService, adminUserService)
  }

  async accessAllowed(tokenData: ITokenData, requestToken: string, context: ExecutionContext) {
    try {
      const adminUser = await this.adminUserService.getById(new Types.ObjectId(tokenData.id), {
        projection: { isUltraSuper: 1, tokens: 1 },
      })
      context.switchToHttp().getRequest().userId = adminUser.id
      return adminUser.isUltraSuper && !!adminUser.tokens.find(tokenData => (tokenData as TokenDataModel).token === requestToken)
    } catch (e) {}
  }
}