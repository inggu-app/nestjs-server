import { ValidateIf, ValidationOptions } from 'class-validator'

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return function IsUndefinedDecorator(prototype: any, propertyKey: string | symbol) {
    ValidateIf(obj => {
      console.log(obj)
      return obj[propertyKey] !== undefined
    }, options)(prototype, propertyKey)
  }
}
