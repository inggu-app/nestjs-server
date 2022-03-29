import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({
    description: 'Название роли',
    maxLength: 60,
    example: 'Администратор',
  })
  @IsString()
  @MaxLength(60)
  label: string
}
