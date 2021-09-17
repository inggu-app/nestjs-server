import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'

interface Options {
  fieldsEnum: { [key: string]: string }
  additionalFieldsEnum?: { [key: string]: string }
  forbiddenFieldsEnum?: { [key: string]: string }
}

@Injectable()
export class ParseFieldsPipe implements PipeTransform<any, string[] | undefined> {
  private readonly fields: string[]

  constructor(options?: Options) {
    if (options) {
      this.fields = ['id', ...Object.keys(options.fieldsEnum)]
      if (options.additionalFieldsEnum)
        this.fields = [...this.fields, ...Object.keys(options.additionalFieldsEnum)]
      if (options.forbiddenFieldsEnum)
        this.fields = this.fields.filter(field =>
          options.forbiddenFieldsEnum ? !(field in options.forbiddenFieldsEnum) : false
        )
    }
  }

  transform(value: any): string[] | undefined {
    if (typeof value != 'string') {
      return undefined
    } else if (value === '') {
      throw new HttpException('Поле fields не должно быть пустым', HttpStatus.BAD_REQUEST)
    }

    const remainingCharacters = value.replace(/([a-zA-Z0-9,_])+/g, '')

    if (remainingCharacters) {
      throw new HttpException(
        `В значении query-параметра fields обнаружены лишние символы - ${remainingCharacters}`,
        HttpStatus.BAD_REQUEST
      )
    }

    const receivedFields = value.split(',')

    receivedFields.forEach(receivedField => {
      if (!this.fields.includes(receivedField)) {
        throw new HttpException(`Поле ${receivedField} не существует`, HttpStatus.BAD_REQUEST)
      }
    })

    return value.split(',')
  }
}
