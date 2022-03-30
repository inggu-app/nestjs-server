import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Types } from 'mongoose'
import { AvailabilityModel } from '../../modules/user/models/user.model'

export interface RequestUser<T extends AvailabilityModel[keyof AvailabilityModel]> {
  id: Types.ObjectId
  availability: T
}

export const RequestUser = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  return request.user
})
