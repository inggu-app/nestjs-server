import { Query } from '@nestjs/common'
import { ParseFieldsPipe, ParseFieldsPipeOptions } from '../pipes/fields.pipe'

export const Fields = (data: ParseFieldsPipeOptions) => {
  return Query('fields', new ParseFieldsPipe(data))
}
