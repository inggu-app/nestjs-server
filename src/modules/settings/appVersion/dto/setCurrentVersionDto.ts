import { IsIn, IsString, Matches } from 'class-validator'
import { OperationSystems } from '../../../../global/enums/OS.enum'

export class SetCurrentVersionDto {
  @IsIn([OperationSystems.ANDROID, OperationSystems.IOS])
  os: OperationSystems

  @IsString()
  @Matches(/\d+.\d+.\d+/)
  version: string
}
