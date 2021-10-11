import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { Reflector } from '@nestjs/core'
import { bearerTokenRegExp } from '../regex'
import { JwtService } from '@nestjs/jwt'
import { UserAccessTokenData, UserService } from '../../modules/user/user.service'
import { UserModel } from '../../modules/user/user.model'
import { FunctionalityCodesEnum } from '../enums/functionalities.enum'
import { Request } from 'express'
import { AvailableFunctionality } from '../../modules/functionality/functionality.constants'

@Injectable()
export class BaseJwtAuthGuard implements CanActivate, JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService
  ) {}

  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request): Promise<boolean> {
    return true
  }

  protected static getBody<T>(request: Request<any, any, T>): T {
    return request.body
  }

  async canActivate(context: ExecutionContext) {
    const code = this.reflector.get<FunctionalityCodesEnum>('code', context.getHandler())

    const bearer = context.switchToHttp().getRequest().headers.authorization as string
    if (!bearer || !bearerTokenRegExp.test(bearer)) throw new UnauthorizedException()

    const token = bearer.split(' ')[1]

    if (!(await this.jwtService.verifyAsync(token))) throw new UnauthorizedException()

    const tokenData = this.jwtService.decode(token) as UserAccessTokenData
    const user = await this.userService.getById(tokenData.id, { queryOptions: { populate: { path: 'roles' } } })

    if (!user) throw new UnauthorizedException()
    const functionality = user.available.find(functionality => functionality.code === code)
    if (!functionality) throw new ForbiddenException()

    return this.validate(functionality, user, context.switchToHttp().getRequest<Request>())
  }
}

export interface JwtAuthGuardValidate {
  validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request): boolean | Promise<boolean>
}
