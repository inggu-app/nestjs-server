import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_OS } from '../constants/errors.constants'
import { OSs } from '../constants/other.constants'

@Injectable()
export class OsPipe implements PipeTransform<any, Date> {
  transform(value: any): Date {
    if (!OSs.includes(value)) {
      throw new BadRequestException(INVALID_OS)
    }

    return value
  }
}
