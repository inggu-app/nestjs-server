import { IsDefined, isMongoId } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'
import { BadRequestException } from '@nestjs/common'

function transformMongoIdWithParams(params: TransformFnParams): Types.ObjectId | undefined {
  if (isMongoId(params.value)) {
    return Types.ObjectId(params.value)
  } else {
    throw new BadRequestException(`${params.key} must be a mongodb id`)
  }
}

export const IsMongoIdWithTransform = (): PropertyDecorator => {
  return (target: any, key: string | symbol): void => {
    IsDefined()(target, key)

    Transform(params => transformMongoIdWithParams(params))(target, key)
  }
}
