import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { IsNullable } from '../../../global/decorators/IsNullable.decorator'
import { ApiProperty } from '@nestjs/swagger'

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
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  faculty: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Id расписания звонков',
    description:
      'Расписание звонков, которое привязывается к группе. Если расписание звонков не указать, то группе будет присвоено расписания звонков факультета, если оно у него есть, или глобальное расписание звонков.',
    example: '6203ce8cff1a854919f38314',
    type: 'MongoId',
    nullable: true,
  })
  @IsUndefinable()
  @IsNullable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId | null
}
