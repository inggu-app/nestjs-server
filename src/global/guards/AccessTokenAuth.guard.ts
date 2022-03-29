import { ITokenData } from '../types'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { envVariables } from '../constants/envVariables.constants'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../modules/user/user.service'

export interface IAccessTokenAuth {
  accessAllowed(tokenData: ITokenData, token: string, context: ExecutionContext): boolean | Promise<boolean | undefined> | undefined
}

@Injectable()
export class AccessTokenAuthGuard implements CanActivate, IAccessTokenAuth {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly adminUserService: UserService
  ) {}

  accessAllowed(tokenData: ITokenData, token: string, context: ExecutionContext): boolean | Promise<boolean | undefined> | undefined {
    return true
  }

  async canActivate(context: ExecutionContext) {
    if ((await this.adminUserService.countMany()) === 0) return true
    const token = context.switchToHttp().getRequest().cookies['access_token']

    if (token) {
      try {
        if (await this.jwtService.verifyAsync(token, { secret: this.configService.get(envVariables.tokenJwtSecretKey) })) {
          const tokenData = this.jwtService.decode(token) as ITokenData
          return !!(await this.accessAllowed(tokenData, token, context))
        }
      } catch (e) {}
    }

    throw new ForbiddenException('Доступ запрещён')
  }
}
