import { Query } from '@nestjs/common'
import { ParseStringByEnumPipe } from '../pipes/enum.pipe'

interface Options {
  required: boolean
}

export const EnumQueryParam = (parameter: string, enumerator: any, options?: Options) => {
  return Query(parameter, new ParseStringByEnumPipe(parameter, enumerator, options))
}
