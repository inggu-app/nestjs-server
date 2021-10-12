import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel } from '../user/user.model'
import { AvailableFunctionality } from './functionality.constants'
import { ForbiddenException } from '@nestjs/common'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

export class FunctionalityJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.FUNCTIONALITIES__GET:
        return true
    }
    throw new ForbiddenException()
  }
}
