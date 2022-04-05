import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { FacultyService } from '../../modules/faculty/faculty.service'
import { FacultyModel } from '../../modules/faculty/faculty.model'
import { customIsMongoId } from './IsMongoIdWithTransform.decorator'
import { GroupModel } from '../../modules/group/group.model'
import { GroupService } from '../../modules/group/services/group.service'
import { CallScheduleService } from '../../modules/callSchedule/callSchedule.service'
import { CallScheduleModel } from '../../modules/callSchedule/callSchedule.model'
import { RoleModel } from '../../modules/user/models/role.model'
import { RoleService } from '../../modules/user/services/role.service'
import { UserService } from '../../modules/user/services/user.service'
import { UserModel } from '../../modules/user/models/user.model'

export function CheckExists(model: any, mustBeAnArray: boolean, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string | symbol) => {
    registerDecorator({
      name: 'CheckExists',
      propertyName: propertyName.toString(),
      target: object.constructor,
      constraints: [validationOptions, model, mustBeAnArray],
      options: validationOptions,
      validator: CheckExistsValidator,
    })
  }
}

@ValidatorConstraint({ async: true, name: 'CheckExists' })
@Injectable()
export class CheckExistsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService,
    private readonly callScheduleService: CallScheduleService,
    private readonly roleService: RoleService,
    private readonly userService: UserService
  ) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    if (Array.isArray(value)) {
      if (!value.reduce((acc, item) => acc && customIsMongoId(item), true) || !value.length) return true
    } else {
      const mustBeAnArray = validationArguments?.constraints[2] as boolean
      if (!customIsMongoId(value) || mustBeAnArray) return true
    }

    const model = validationArguments?.constraints[1]
    switch (model.name) {
      case FacultyModel.name:
        await this.facultyService.throwIfNotExists(value)
        break
      case GroupModel.name:
        await this.groupService.throwIfNotExists(value)
        break
      case CallScheduleModel.name:
        await this.callScheduleService.throwIfNotExists(value)
        break
      case RoleModel.name:
        await this.roleService.throwIfNotExists(value)
        break
      case UserModel.name:
        await this.userService.throwIfNotExists(value)
        break
    }

    return true
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return buildMessage(eachPrefix => `${eachPrefix}$property doesn't exists`, validationArguments?.constraints[0])(validationArguments)
  }
}
