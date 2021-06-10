import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoId()
  faculty: string
}
