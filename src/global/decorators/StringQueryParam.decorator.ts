import { Query } from '@nestjs/common'
import { CustomParseStringPipe } from '../pipes/string.pipe'

interface Options {
  required?: boolean
}

export const StringQueryParam = (parameter: string, options?: Options) => {
  return Query(parameter, new CustomParseStringPipe(parameter, { ...options }))
}
