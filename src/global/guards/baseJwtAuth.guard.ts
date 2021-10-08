import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { Reflector } from '@nestjs/core'
import { bearerTokenRegExp } from '../regex'
import { JwtService } from '@nestjs/jwt'
import { UserAccessTokenData, UserService } from '../../modules/user/user.service'
import { UserModel } from '../../modules/user/user.model'
import { FunctionalityCodesEnum } from '../enums/functionalities.enum'
import { Request } from 'express'
import { parseRequestQueries } from '../utils/parseRequestQueries'

@Injectable()
export class BaseJwtAuthGuard implements CanActivate, JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService
  ) {}

  async validate(functionalityCode: FunctionalityCodesEnum, user: DocumentType<UserModel>, context: ExecutionContext): Promise<boolean> {
    return true
  }

  protected static getBodyFromContext<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest<Request<any, any, T>>().body
  }

  protected static getQueryParameters<T extends string>(names: T[], context: ExecutionContext) {
    return parseRequestQueries<T>(names, context.switchToHttp().getRequest<Request>().url)
  }

  async canActivate(context: ExecutionContext) {
    const code = this.reflector.get<FunctionalityCodesEnum>('code', context.getHandler())

    const bearer = context.switchToHttp().getRequest().headers.authorization as string
    if (!bearer || !bearerTokenRegExp.test(bearer)) throw new UnauthorizedException()

    const token = bearer.split(' ')[1]

    if (!(await this.jwtService.verifyAsync(token))) throw new UnauthorizedException()

    const tokenData = this.jwtService.decode(token) as UserAccessTokenData
    return this.validate(code, await this.userService.getById(tokenData.id), context)
  }
}

export interface JwtAuthGuardValidate {
  validate(functionalityCode: FunctionalityCodesEnum, user: DocumentType<UserModel>, context: ExecutionContext): boolean | Promise<boolean>
}
