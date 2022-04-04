import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'

export class CreateGroupDto {
  @ApiProperty({
    title: 'Название группы',
    example: 'Группа',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title: string

  @ApiProperty({
    title: 'Id факультета, к которому привязывается группа',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  faculty: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Id расписания звонков',
    description:
      'Расписание звонков, которое привязывается к группе. Если расписание звонков не указать, то группе будет присвоено расписания звонков факультета, если оно у него есть, или глобальное расписание звонков.',
    example: MongoIdExample,
    type: 'MongoId',
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
