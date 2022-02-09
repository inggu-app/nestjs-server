import { IsDefined, isMongoId, IsOptional } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'
import { BadRequestException } from '@nestjs/common'

function transformMongoIdWithParams(params: TransformFnParams, isOptional: boolean): Types.ObjectId | undefined | null {
  if (isOptional && (params.value === undefined || params.value === null)) return params.value
  if (isMongoId(params.value)) {
    return Types.ObjectId(params.value)
  } else {
    throw new BadRequestException(`${params.key} must be a mongodb id`)
  }
}

export const IsMongoIdWithTransform = (isOptional = false): PropertyDecorator => {
  return (target: any, key: string | symbol): void => {
    if (isOptional) IsOptional()(target, key)
    else IsDefined()(target, key)

    Transform(params => transformMongoIdWithParams(params, isOptional))(target, key)
  }
}
