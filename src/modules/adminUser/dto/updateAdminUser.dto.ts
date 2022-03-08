import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAdminUserDto {
  @ApiProperty({
    title: 'Id администратора, которого необходимо обновить',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Имя администратора, на которое нужно заменить текущее имя.',
    example: 'Администратор',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string

  @ApiProperty({
    required: false,
    title: 'Логин администратора, на который нужно заменить текущее имя.',
    example: 'admin',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login?: string
}
