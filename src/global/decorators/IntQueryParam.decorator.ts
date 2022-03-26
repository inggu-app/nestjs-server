import { Query } from '@nestjs/common'
import { CustomParseIntPipe } from '../pipes/int.pipe'

interface Options {
  required?: boolean
  intType?: 'positive' | 'negative' | 'all'
}

export const IntQueryParam = (parameter: string, options?: Options) => {
  return Query(parameter, new CustomParseIntPipe(parameter, { ...options }))
}
