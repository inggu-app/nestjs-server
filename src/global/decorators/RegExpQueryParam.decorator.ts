import { Query } from '@nestjs/common'
import { CustomParseStringPipe } from '../pipes/string.pipe'

interface Options {
  required?: boolean
}

export const RegExpQueryParam = (parameter: string, regExp: RegExp, options?: Options) => {
  return Query(parameter, new CustomParseStringPipe(parameter, { regExp, ...options }))
}
