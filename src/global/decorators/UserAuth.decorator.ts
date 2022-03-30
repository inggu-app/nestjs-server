import { AvailabilityModel, TokenDataModel } from '../../modules/user/models/user.model'
import { applyDecorators, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../../modules/user/services/user.service'
import { ITokenData } from '../types'
import { Types } from 'mongoose'
import { AccessTokenAuthGuard, IAccessTokenAuth } from '../guards/AccessTokenAuth.guard'

type UserAuthOptions<T extends keyof AvailabilityModel> = {
  availability: T
  availabilityKey: keyof AvailabilityModel[T]
}

export const UserAuth = <T extends keyof AvailabilityModel>(options: UserAuthOptions<T>) => {
  return applyDecorators(
    SetMetadata('availability', options.availability),
    SetMetadata('availabilityKey', options.availabilityKey),
    UseGuards(UserAuthGuard)
  )
}

@Injectable()
export class UserAuthGuard extends AccessTokenAuthGuard implements IAccessTokenAuth {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly userService: UserService
  ) {
    super(jwtService, configService, userService)
  }

  async accessAllowed(tokenData: ITokenData, requestToken: string, context: ExecutionContext) {
    try {
      const availability: keyof AvailabilityModel = this.reflector.get('availability', context.getHandler())
      const availabilityKey: keyof AvailabilityModel[typeof availability] = this.reflector.get('availabilityKey', context.getHandler())

      const user = await this.userService.getById(new Types.ObjectId(tokenData.id), {
        projection: { availability: 1, tokens: 1 },
      })
      context.switchToHttp().getRequest().user = {
        id: Types.ObjectId(user.id),
        availability: user.availability[availability],
      }

      return (
        user.availability[availability][availabilityKey] &&
        !!user.tokens.find(tokenData => (tokenData as TokenDataModel).token === requestToken)
      )
    } catch (e) {}
  }
}
