import { TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'
import { isMongoId } from 'class-validator'
import { BadRequestException } from '@nestjs/common'

export function transformMongoIdWithParams(params: TransformFnParams): Types.ObjectId {
  if (isMongoId(params.value)) {
    return Types.ObjectId(params.value)
  } else {
    throw new BadRequestException(`${params.key} must be a mongodb id`)
  }
}
