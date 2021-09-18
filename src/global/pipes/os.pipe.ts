import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_OS } from '../constants/errors.constants'
import { OSs } from '../constants/other.constants'

@Injectable()
export class OsPipe implements PipeTransform<any, Date> {
  transform(value: any): Date {
    if (value === undefined) return value

    if (!OSs.includes(value)) {
      throw new HttpException(INVALID_OS, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
