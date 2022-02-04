import {
  isObject,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { objectValues } from '../utils/objectKeys'

@ValidatorConstraint({ name: 'mongoModelProjection', async: false })
class MongoModelProjectionConstraint implements ValidatorConstraintInterface {
  validate(value: Record<string, any>, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!this.checkIsObject(validationArguments)) return false
    if (!this.checkOnly01Characters(validationArguments)) return false
    if (this.checkBothIdKeys(validationArguments)) return false
    if (!this.checkOnly0Character(validationArguments) && !this.checkOnly1Character(validationArguments)) return false

    return true
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!this.checkIsObject(validationArguments)) return `${validationArguments?.property} должно быть объектом`
    if (!this.checkOnly01Characters(validationArguments))
      return `В значениях полей в объекте ${validationArguments?.property} могут находиться только 0 и 1`
    if (this.checkBothIdKeys(validationArguments))
      return `В объекте ${validationArguments?.property} не могут одновременно находиться _id и id`
    if (!this.checkOnly0Character(validationArguments) && !this.checkOnly1Character(validationArguments))
      return `В полях объекта ${validationArguments?.property} могут лежать одновременно только 0 или только 1, не считая поля _id и id`

    return 'Неизвестная ошибка'
  }

  // Проверка на то, что значение является объектом
  // Если значение это объект, то возвращается true
  // Если значение это не объект, то возвращается false
  checkIsObject(validationArguments?: ValidationArguments) {
    return isObject(validationArguments?.value)
  }

  // Проверка на то, что в значениях полей лежат только нули и единицы
  // Если лежат только нули и единицы, то возвращается true
  // Если лежит что-то кроме нулей е единиц, то возвращается false
  checkOnly01Characters(validationArguments?: ValidationArguments) {
    let isCorrect = true
    for (const value of objectValues(validationArguments?.value)) {
      if (value !== 1 && value !== 0) isCorrect = false
    }
    return isCorrect
  }

  // Проверка на нахождение в объекте одновременно _id и id
  // Если оба поля есть, то возвращается true
  // Если есть один из ключей или нет ни одного, то возвращается false
  checkBothIdKeys(validationArguments?: ValidationArguments) {
    return validationArguments?.value.id !== undefined && validationArguments.value._id !== undefined
  }

  // Проверка на то, что все поля кроме _id или id имеют значение единицы
  // Если все единицы, то возвращается true
  // Если не все единицы, то возвращается false
  checkOnly1Character(validationArguments?: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, _id, ...fields }: Record<string, number> = validationArguments?.value
    let isCorrect = true
    for (const value of objectValues(fields)) {
      if (value !== 1) isCorrect = false
    }
    return isCorrect
  }

  // Проверка на то, что все поля кроме _id или id имеют значение нуля
  // Если все нули, то возвращается true
  // Если не все нули, то возвращается false
  checkOnly0Character(validationArguments?: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, _id, ...fields }: Record<string, number> = validationArguments?.value
    let isCorrect = true
    for (const value of objectValues(fields)) {
      if (value !== 0) isCorrect = false
    }
    return isCorrect
  }
}

export function MongoModelProjection(property?: string, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'mongoModelProjection',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: MongoModelProjectionConstraint,
    })
  }
}
