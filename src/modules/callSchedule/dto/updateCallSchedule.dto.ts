import { IsArray, IsBoolean, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItem } from './createCallSchedule.dto'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCallScheduleDto {
  @ApiProperty({
    title: 'Id расписания звонков, которое необходимо обновить',
    example: '6203ce8cff1a854919f38314',
    type: 'MongoId',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Список элементов расписания звонков, на который нужно обновить',
    type: [CallScheduleItem],
  })
  @IsUndefinable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule?: CallScheduleItem[]

  @ApiProperty({
    required: false,
    title: 'Название, на которое нужно заменить текущее названия расписания звонков',
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string

  @ApiProperty({
    required: false,
    title: 'Установка расписания как дефолтное расписание звонков. Если до этого было дефолтное расписание, то оно становится неактивным',
  })
  @IsUndefinable()
  @IsBoolean()
  isDefault: boolean
}
