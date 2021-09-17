import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { isInt } from 'class-validator'
import { INCORRECT_INT } from '../constants/errors.constants'

@Injectable()
export class CustomParseIntPipe implements PipeTransform<any, number | undefined> {
  transform(value: any): number | undefined {
    if (value === undefined) return value

    if (!isInt(Number(value))) {
      throw new HttpException(INCORRECT_INT, HttpStatus.BAD_REQUEST)
    }

    return Number(value)
  }
}
