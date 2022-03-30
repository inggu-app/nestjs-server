import {
  buildMessage,
  IsDefined,
  isMongoId,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'
import { Types } from 'mongoose'

function transformMongoIdWithParams(params: TransformFnParams): Types.ObjectId | Types.ObjectId[] | undefined {
  if (Array.isArray(params.value)) {
    if (!params.value.reduce((acc: boolean, item: any) => acc && isMongoId(item), true)) return params.value
    return params.value.map((item: string) => Types.ObjectId(item))
  } else {
    if (!isMongoId(params.value)) return params.value
    return Types.ObjectId(params.value)
  }
}

export const IsMongoIdWithTransform = (validationOptions?: ValidationOptions): PropertyDecorator => {
  return (target: any, key: string | symbol): void => {
    IsDefined(validationOptions)(target, key)
    CustomIsMongoId(validationOptions)(target, key)

    Transform(transformMongoIdWithParams)(target, key)
  }
}

function CustomIsMongoId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      name: 'CustomIsMongoId',
      target: object.constructor,
      propertyName: propertyName.toString(),
      constraints: [validationOptions],
      options: validationOptions,
      validator: CustomIsMongoIdValidator,
    })
  }
}

@ValidatorConstraint({ async: true, name: 'CustomIsMongoId' })
export class CustomIsMongoIdValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value instanceof Types.ObjectId) return isMongoId(value.toHexString())
    else return isMongoId(value)
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return buildMessage(eachPrefix => `${eachPrefix}$property must be a mongo id`, validationArguments?.constraints[0])(validationArguments)
  }
}
