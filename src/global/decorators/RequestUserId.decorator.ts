import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Types } from 'mongoose'

export const RequestUserId = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  return Types.ObjectId(request.userId)
})
