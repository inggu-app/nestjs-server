import { IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateRoleDto {
  @IsString()
  title: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  functionalities: Functionality[]
}

class Functionality {
  @IsMongoId()
  functionality: string

  @IsArray()
  @Type(() => Object)
  data: {
    [key: string]: any
  }[]
}
