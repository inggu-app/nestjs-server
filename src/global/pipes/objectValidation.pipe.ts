import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

interface Options {
  dto: any
  parameterName: string
  required?: boolean
  isArray?: boolean
}

const defaultOptions: Options = {
  dto: null,
  parameterName: '',
  required: true,
  isArray: false,
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
      const object = plainToClass(this.options.dto, param)
      const errorsList = await validate(object)
      if (errorsList.length > 0) {
        throw new BadRequestException(errorsList.map(error => (error.constraints ? Object.values(error.constraints) : [])).flat())
      }
    }

    return parsedParameter
  }
}
