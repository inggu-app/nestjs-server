import { ApiProperty } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'

export class ResponseExceptionDto {
  @ApiProperty({})
  statusCode: HttpStatus

  @ApiProperty({
    required: false,
    example: 'Доступ запрещён',
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'string[]',
      },
    ],
  })
  message: string | string[]

  @ApiProperty({
    example: 'Forbidden',
  })
  error: string
}
