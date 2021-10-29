import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { Reflector } from '@nestjs/core'
import { bearerTokenRegExp } from '../regex'
import { JwtService } from '@nestjs/jwt'
import { UserAccessTokenData, UserService } from '../../modules/user/user.service'
import { UserModel } from '../../modules/user/user.model'
import { FunctionalityCodesEnum } from '../enums/functionalities.enum'
import { Request } from 'express'
import { AvailableFunctionality } from '../../modules/functionality/functionality.constants'
import { ConfigService } from '@nestjs/config'
import { RoleModel } from '../../modules/role/role.model'

export interface CustomRequest<Body = any, FunctionalityType = { [key: string]: any }> extends Omit<Request<any, any, Body>, 'user'> {
  user: DocumentType<UserModel> | undefined
  functionality: AvailableFunctionality<FunctionalityType>
}

@Injectable()
export class BaseJwtAuthGuard implements CanActivate, JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService
  ) {}

  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request): Promise<boolean> {
    return true
  }

  protected static getBody<T>(request: Request<any, any, T>): T {
    return request.body
  }

  async canActivate(context: ExecutionContext) {
    const bearer = context.switchToHttp().getRequest().headers.authorization as string
    if (bearer && bearerTokenRegExp.test(bearer)) {
      const token = bearer.split(' ')[1]

      try {
        if (await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_SECRET_KEY') })) {
          const tokenData = this.jwtService.decode(token) as UserAccessTokenData
          const user = await this.userService.getById(tokenData.id, {
            queryOptions: { populate: { path: 'roles', populate: { path: 'role', select: ['priority', 'available', 'title'] } } },
          })

          if (user) {
            const code = this.reflector.get<FunctionalityCodesEnum>('code', context.getHandler())
            const functionalities = user.available
            user.roles
              .sort((a, b) => {
                a.role = a.role as RoleModel
                b.role = b.role as RoleModel
                return b.role.priority - a.role.priority
              })
              .forEach(role => {
                role.role = role.role as RoleModel
                role.role.available.forEach(functionality => {
                  if (!functionalities.find(f => f.code === functionality.code)) {
                    functionalities.push(functionality)
                  }
                })
              })

            const functionality = functionalities.find(functionality => functionality.code === code)

            if (functionality) {
              context.switchToHttp().getRequest<CustomRequest>().user = user
              context.switchToHttp().getRequest<CustomRequest>().functionality = functionality
              return this.validate(functionality, user, context.switchToHttp().getRequest<Request>())
            }
          }
        }
      } catch (e) {}
    }

    const adminToken = context.switchToHttp().getRequest().headers.admin as string
    try {
      if (adminToken && (await this.jwtService.verifyAsync(adminToken, { secret: this.configService.get('ADMIN_JWT_SECRET_KEY') }))) {
        return true
      }
    } catch (e) {}

    throw new ForbiddenException()
  }
}

export interface JwtAuthGuardValidate {
  validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request): boolean | Promise<boolean>
}
