import { Query } from '@nestjs/common'
import { ParseDatePipe } from '../pipes/date.pipe'

interface Options {
  required?: boolean
}

export const DateQueryParam = (parameter: string, options?: Options) => {
  return Query(parameter, new ParseDatePipe(parameter, options))
}
