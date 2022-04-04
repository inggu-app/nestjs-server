import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'

export class CreateFacultyDto {
  @ApiProperty({
    title: 'Название факультета',
    example: 'Экономический факультет',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title: string

  @ApiProperty({
    required: false,
    type: MongoIdType,
    title: 'Id расписания звонков',
    description:
      'Сюда необходимо передать id расписания звонков, которое нужно назначить факультету. Назначенное расписание звонков будет распространяться на все группы этого факультета, если у этих групп нет собственного расписания звонков.',
    example: MongoIdExample,
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
