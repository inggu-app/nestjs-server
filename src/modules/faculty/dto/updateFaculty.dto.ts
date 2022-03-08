import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { IsNullable } from '../../../global/decorators/IsNullable.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateFacultyDto {
  @ApiProperty({
    title: 'Id факультета, который нужно обновить.',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Название факультета',
    description: 'Название, на которое нужно заменить текущее название факультета. Название не может быть пустой строкой.',
    example: 'Экономический факультет',
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
    type: 'MongoId',
    title: 'Id расписания звонков',
    description:
      'Id расписания звонков, на которое необходимо заменить текущее расписание звонков. Можно передать null чтобы сбросить установленное расписание.',
    nullable: true,
  })
  @IsUndefinable()
  @IsNullable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId | null
}
