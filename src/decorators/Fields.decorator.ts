import { createParamDecorator, Query } from '@nestjs/common'
import { ParseFieldsPipe, ParseFieldsPipeOptions } from '../global/pipes/fields.pipe'

export const Fields = createParamDecorator((data: ParseFieldsPipeOptions) => {
  return Query('fields', new ParseFieldsPipe(data))
})
