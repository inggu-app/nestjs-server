import { IsNumber } from 'class-validator'

export class CreateWeeksCountDto {
  @IsNumber()
  count: number
}
