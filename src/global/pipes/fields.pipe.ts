import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { ScheduleField } from '../../modules/schedule/schedule.constants'

export type Projection<T extends string, K extends string = 'id'> = {
  [key in T | K]?: {
    projection: 0 | 1
    children?: Projection<T, K>
  }
}

interface TranslateObject {
  [key: string]: 0 | 1 | TranslateObject
}

@Injectable()
export class ParseFieldsPipe implements PipeTransform<any, Projection<ScheduleField> | undefined> {
  private readonly fields: string[]

  constructor(
    fieldsEnum: { [key: string]: string },
    additionalFieldsEnum?: { [key: string]: string }
  ) {
    this.fields = ['id', ...Object.keys(fieldsEnum)]
    if (additionalFieldsEnum) this.fields = [...this.fields, ...Object.keys(additionalFieldsEnum)]
  }

  transform(value: any): Projection<ScheduleField> | undefined {
    if (typeof value != 'string') {
      return undefined
    } else if (value === '') {
      throw new HttpException('Поле fields не должно быть пустым', HttpStatus.BAD_REQUEST)
    } else if (value.match('{}')) {
      throw new HttpException('Фигурные скобки не должны быть пустыми', HttpStatus.BAD_REQUEST)
    } else if (value.match(/{/g)?.length !== value.match(/}/g)?.length) {
      throw new HttpException('Некорректное количество фигурных скобок', HttpStatus.BAD_REQUEST)
    }

    const remainingCharacters = value.replace(/([a-zA-Z0-9,_{}])+/g, '')

    if (remainingCharacters) {
      throw new HttpException(
        `В значении query-параметра fields обнаружены лишние символы - ${remainingCharacters}`,
        HttpStatus.BAD_REQUEST
      )
    }

    const receivedFields: string[] = []

    let val: string = value
    while (true) {
      const newValue = val.replace(/{[\w,]*}/g, '')

      if (newValue.match(/{[\w,]*}/g)) {
        val = newValue
      } else {
        receivedFields.push(...newValue.split(','))
        break
      }
    }

    receivedFields.forEach(receivedField => {
      if (!this.fields.includes(receivedField)) {
        throw new HttpException(`Поле ${receivedField} не существует`, HttpStatus.BAD_REQUEST)
      }
    })

    return translate(
      JSON.parse(
        '{"' +
          `${value}}`
            .replace(/,/g, ':1,')
            .replace(/{/g, ':{"')
            .replace(/}/g, ':1}')
            .replace(/}:1/g, '}')
            .replace(/:/g, '":')
            .replace(/,/g, ',"')
      )
    )
  }
}

export const translate = (obj: TranslateObject) => {
  const fields: Projection<string> = {}

  Object.keys(obj).forEach(field => {
    if (obj[field] === 0 || obj[field] === 1) {
      fields[field] = {
        projection: 1,
      }
    } else {
      const object: TranslateObject = <TranslateObject>obj[field]

      fields[field] = {
        projection: 1,
        children: translate(object),
      }
    }
  })

  return fields
}
