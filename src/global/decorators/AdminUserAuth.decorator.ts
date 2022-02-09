import { Availability, TokenDataModel } from '../../modules/adminUser/adminUser.model'
import { applyDecorators, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AdminUserService } from '../../modules/adminUser/adminUser.service'
import { ITokenData } from '../types'
import { Types } from 'mongoose'
import { AccessTokenAuthGuard, IAccessTokenAuth } from '../guards/AccessTokenAuth.guard'

interface AdminUserAuthOptions {
  availability: keyof Availability
}

export const AdminUserAuth = (options: AdminUserAuthOptions) => {
  return applyDecorators(SetMetadata('availability', options.availability), UseGuards(AdminUserAuthGuard))
}

@Injectable()
export class AdminUserAuthGuard extends AccessTokenAuthGuard implements IAccessTokenAuth {
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
        projection: { availability: 1, tokens: 1 },
      })
      context.switchToHttp().getRequest().userId = adminUser.id

      const availability: keyof Availability = this.reflector.get('availability', context.getHandler())
      return (
        (adminUser.availability as Availability)[availability] &&
        !!adminUser.tokens.find(tokenData => (tokenData as TokenDataModel).token === requestToken)
      )
    } catch (e) {}
  }
}
