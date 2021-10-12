import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import { InterfaceField, InterfaceFieldsEnum, InterfaceGetQueryParametersEnum, InterfaceRoutesEnum } from './interface.constants'
import { CreateInterfaceDto } from './dto/createInterface.dto'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { Fields } from '../../global/decorators/Fields.decorator'
import { UpdateInterfaceDto } from './dto/updateInterface.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { Types } from 'mongoose'

@Controller()
export class InterfaceController {
  constructor(private readonly interfaceService: InterfaceService) {}

  @UsePipes(new ValidationPipe())
  @Post(InterfaceRoutesEnum.CREATE)
  create(@Body() dto: CreateInterfaceDto) {
    return this.interfaceService.create(dto)
  }

  @Get(InterfaceRoutesEnum.GET_BY_CODE)
  getByCode(
    @Query(InterfaceGetQueryParametersEnum.CODE, new CustomParseStringPipe()) code: string,
    @GetInterfaceFields() fields?: InterfaceField[]
  ) {
    return this.interfaceService.getByCode(code, { fields })
  }

  @Patch(InterfaceRoutesEnum.UPDATE)
  update(dto: UpdateInterfaceDto) {
    return this.interfaceService.update(dto)
  }

  @Delete(InterfaceRoutesEnum.DELETE)
  delete(@MongoId('interfaceId') interfaceId: Types.ObjectId) {
    return this.interfaceService.delete(interfaceId)
  }
}

function GetInterfaceFields() {
  return Fields({ fieldsEnum: InterfaceFieldsEnum })
}
