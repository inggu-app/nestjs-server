import { IsDefined, isMongoId, ValidationOptions } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'
import { BadRequestException } from '@nestjs/common'

function transformMongoIdWithParams(
  params: TransformFnParams,
  validationOptions?: ValidationOptions
): Types.ObjectId | Types.ObjectId[] | undefined {
  if (validationOptions?.each) {
    if (!Array.isArray(params.value)) throw new BadRequestException(`${params.key} must be an array`)

    const errors: string[] = []
    const result: Types.ObjectId[] = []
    params.value.forEach((item, index) => {
      if (isMongoId(item)) result.push(Types.ObjectId(item))
      else errors.push(`${params.key}.${index} must be a mongodb id`)
    })

    if (errors.length) {
      throw new BadRequestException(errors)
    } else {
      return result
    }
  } else {
    if (isMongoId(params.value)) return Types.ObjectId(params.value)
    else throw new BadRequestException(`${params.key} must be a mongodb id`)
  }
}

export const IsMongoIdWithTransform = (validationOptions?: ValidationOptions): PropertyDecorator => {
  return (target: any, key: string | symbol): void => {
    IsDefined(validationOptions)(target, key)

    Transform(params => transformMongoIdWithParams(params, validationOptions))(target, key)
  }
}
