import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Types } from 'mongoose'
import { AvailabilitiesModel } from '../../modules/user/models/user.model'

export interface RequestUser<T extends AvailabilitiesModel[keyof AvailabilitiesModel]> {
  id: Types.ObjectId
  availability: T
}

export const RequestUser = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  return request.user
})
