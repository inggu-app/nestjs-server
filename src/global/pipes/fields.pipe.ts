import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseFieldsPipe implements PipeTransform<any, string[]> {
  private readonly fields: string[]

  constructor(
    fieldsEnum: { [key: string]: string },
    additionalFieldsEnum?: { [key: string]: string }
  ) {
    this.fields = ['id', ...Object.keys(fieldsEnum)]
    if (additionalFieldsEnum) this.fields = [...this.fields, ...Object.keys(additionalFieldsEnum)]
  }

  transform(value: any): string[] {
    if (typeof value != 'string') {
      return this.fields
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