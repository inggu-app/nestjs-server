import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({
    description: 'Название роли',
    maxLength: 60,
    minLength: 1,
    example: 'Администратор',
  })
  @IsString()
  @MaxLength(60)
  @MinLength(1)
  label: string
}
