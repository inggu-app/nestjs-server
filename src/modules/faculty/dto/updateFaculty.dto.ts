import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'
import { FacultyModel } from '../faculty.model'

export class UpdateFacultyDto implements Partial<FacultyModel> {
  @ApiProperty({
    title: 'Id факультета, который нужно обновить.',
    type: MongoIdType,
    example: MongoIdExample,
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
}
