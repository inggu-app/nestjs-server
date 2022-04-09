import {
  isObject,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { objectKeys } from '../utils/objectKeys'

interface Projection {
  [x: string]: Projection | 0 | 1
}

@ValidatorConstraint({ name: 'mongoModelProjection', async: false })
class MongoModelProjectionConstraint implements ValidatorConstraintInterface {
  validate(value: Record<string, any>, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!isObject(value)) return false
    return typeof this.recursiveValidator(value as Projection, 'projection', !validationArguments?.constraints[0] as boolean) === 'boolean'
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!isObject(validationArguments?.value)) return `${validationArguments?.property} должно быть объектом`

    const validationResult = this.recursiveValidator(
      validationArguments?.value as Projection,
      validationArguments?.property,
      !validationArguments?.constraints[0]
    )
    if (typeof validationResult === 'string') return `В объекте ${validationResult} содержится ошибка`

    return 'Неизвестная ошибка'
  }

  recursiveValidator(projection: Projection, path = 'projection', nested = false): boolean | string {
    if (objectKeys(projection).includes('_id')) return path
    if (!objectKeys(projection).length) return path

    const isHaveZeroKeys: string[] = []
    const isHaveOneKeys: string[] = []
    const isHaveNestedProjectionKeys: string[] = []

    let isCorrect = true
    for (const key of objectKeys(projection)) {
      if ((nested && key === 'id') || (projection[key] !== 0 && projection[key] !== 1 && !isObject(projection[key]))) {
        isCorrect = false
        break
      }
      if (projection[key] === 0 && key !== 'id') isHaveZeroKeys.push(key as string)
      if (projection[key] === 1 && key !== 'id') isHaveOneKeys.push(key as string)
      if (isObject(projection[key])) {
        if (key === 'id') {
          isCorrect = false
          break
        }
        isHaveNestedProjectionKeys.push(key as string)
      }
    }
    if (!isCorrect) return path

    if (isHaveZeroKeys.length && (isHaveOneKeys.length || isHaveNestedProjectionKeys.length)) {
      return path
    } else {
      let isCorrect: string | boolean = true
      for (const key of objectKeys(projection)) {
        const value = projection[key]
        if (isObject(value)) isCorrect = this.recursiveValidator(value, `${path}.${key}`, true)
      }

      return isCorrect
    }
  }
}

export function MongoModelProjection(firstLevelId = true, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'mongoModelProjection',
      target: object.constructor,
      propertyName,
      constraints: [firstLevelId],
      options: validationOptions,
      validator: MongoModelProjectionConstraint,
    })
  }
}
