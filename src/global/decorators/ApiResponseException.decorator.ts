import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ResponseExceptionDto } from '../dto/ResponseException.dto'

export const ApiResponseException = () => {
  return applyDecorators(
    ApiResponse({
      type: ResponseExceptionDto,
    })
  )
}
