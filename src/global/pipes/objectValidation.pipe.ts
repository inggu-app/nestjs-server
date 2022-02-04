import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { deleteNested, getNested, setNested } from '../utils/nestedObject'

interface Options {
  dto: any
  parameterName: string
  required?: boolean
  isArray?: boolean
  replaceableKeys?: Record<string, string>
}

const defaultOptions: Options = {
  dto: null,
  parameterName: '',
  required: true,
  isArray: false,
  replaceableKeys: {},
}

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  options: Options
  constructor(options: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  async transform(value: any) {
    if (!this.options.required && value === undefined) return value
    let parsedParameter
    try {
      parsedParameter = JSON.parse(value)
    } catch (e) {
      throw new BadRequestException(`Некорректное значение в параметре ${this.options.parameterName}`)
    }
    if (!this.options.isArray && Array.isArray(parsedParameter)) {
      throw new BadRequestException(`Значение параметра ${this.options.parameterName} должно быть объектом`)
    } else if (this.options.isArray && !Array.isArray(parsedParameter)) {
      throw new BadRequestException(`Значение параметра ${this.options.parameterName} должно быть массивом`)
    }
    const objects = []
    if (Array.isArray(parsedParameter)) {
      objects.push(...parsedParameter)
    } else {
      objects.push(parsedParameter)
    }

    for await (const param of objects) {
      const object = plainToClass(this.options.dto, param, { exposeDefaultValues: true })
      const errorsList = await validate(object, { whitelist: true, forbidNonWhitelisted: true })
      if (errorsList.length > 0) {
        throw new BadRequestException(errorsList.map(error => (error.constraints ? Object.values(error.constraints) : [])).flat())
      }

      if (this.options.replaceableKeys && Object.keys(this.options.replaceableKeys).length) {
        for (const key of Object.keys(this.options.replaceableKeys)) {
          if (getNested(param, key) !== undefined) {
            setNested(param, getNested(param, key), this.options.replaceableKeys[key])
            deleteNested(param, key)
          }
        }
      }
    }

    if (Array.isArray(parsedParameter)) {
      return objects
    } else {
      return objects[0]
    }
  }
}
