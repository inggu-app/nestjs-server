import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_APP_VERSION } from '../constants/errors.constants'
import { matches } from 'class-validator'

@Injectable()
export class AppVersionPipe implements PipeTransform<any, Date> {
  transform(value: any): Date {
    if (!matches(value, /\d+.\d+.\d+/g)) {
      throw new BadRequestException(INVALID_APP_VERSION)
    }

    return value
  }
}
