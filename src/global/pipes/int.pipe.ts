import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isInt } from 'class-validator'

@Injectable()
export class CustomParseIntPipe implements PipeTransform<any, number | undefined> {
  transform(value: any): number | undefined {
    if (value === undefined) return value

    if (!isInt(Number(value))) {
      throw new BadRequestException('Некорректное значение целого числа')
    }

    return Number(value)
  }
}
