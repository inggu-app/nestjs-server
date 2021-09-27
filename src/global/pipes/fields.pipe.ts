import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import {
  FIELDS_QUERY_PARAMETER_IS_EMPTY,
  NOT_EXISTS_FIELD_IN_FIELDS_QUERY_PARAMETER,
  UNNECESSARY_SYMBOLS_IN_FIELDS_QUERY_PARAMETER,
} from '../constants/errors.constants'
import { getEnumKeys } from '../utils/enumKeysValues'

interface Options {
  fieldsEnum: { [key: string]: string }
  additionalFieldsEnum?: { [key: string]: string }
  forbiddenFieldsEnum?: { [key: string]: string }
}

@Injectable()
export class ParseFieldsPipe implements PipeTransform<any, string[] | undefined> {
  private readonly fields: string[]
  private readonly availableFields: string[]

  constructor(options?: Options) {
    if (options) {
      this.fields = ['id', ...getEnumKeys(options.fieldsEnum)]
      if (options.additionalFieldsEnum)
        this.fields = [...this.fields, ...getEnumKeys(options.additionalFieldsEnum)]
      if (options.forbiddenFieldsEnum)
        this.availableFields = this.fields.filter(field =>
          options.forbiddenFieldsEnum ? !(field in options.forbiddenFieldsEnum) : false
        )
    }
  }

  transform(value: any): string[] | undefined {
    if (typeof value != 'string') {
      return this.fields
    } else if (value === '') {
      throw new HttpException(FIELDS_QUERY_PARAMETER_IS_EMPTY, HttpStatus.BAD_REQUEST)
    }

    const unnecessarySymbols = value.replace(/([a-zA-Z0-9,_])+/g, '')

    if (unnecessarySymbols) {
      throw new HttpException(
        UNNECESSARY_SYMBOLS_IN_FIELDS_QUERY_PARAMETER(unnecessarySymbols),
        HttpStatus.BAD_REQUEST
      )
    }

    const receivedFields = value.split(',')

    receivedFields.forEach(receivedField => {
      if (!this.availableFields.includes(receivedField)) {
        throw new HttpException(
          NOT_EXISTS_FIELD_IN_FIELDS_QUERY_PARAMETER(receivedField),
          HttpStatus.BAD_REQUEST
        )
      }
    })

    return value.split(',')
  }
}
