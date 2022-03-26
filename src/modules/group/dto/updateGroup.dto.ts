import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class UpdateGroupDto {
  @ApiProperty({
    title: 'Id группы',
    description: 'Id группы, которую необходимо обновить',
    example: '6203ce8cff1a854919f38314',
    type: 'MongoId',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Название, на которое необходимо заменить текущее название группы',
    example: 'Группа',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title?: string

  @ApiProperty({
    required: false,
    title: 'Id факультета, на который необходимо заменить текущий факультет',
    example: '6203ce8cff1a854919f38314',
    type: 'MongoId',
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  faculty?: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Id расписания звонков, на которое необходимо заменить текущее расписание',
    example: '6203ce8cff1a854919f38314',
    type: 'MongoId',
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
