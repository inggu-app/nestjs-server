import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import {
  defaultInterfaceCreateData,
  defaultInterfaceDeleteData,
  defaultInterfaceGetByCodeData,
  defaultInterfaceUpdateData,
  InterfaceField,
  InterfaceFieldsEnum,
  InterfaceGetQueryParametersEnum,
  InterfaceRoutesEnum,
} from './interface.constants'
import { CreateInterfaceDto } from './dto/createInterface.dto'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { Fields } from '../../global/decorators/Fields.decorator'
import { UpdateInterfaceDto } from './dto/updateInterface.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { Types } from 'mongoose'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

@Controller()
export class InterfaceController {
  constructor(private readonly interfaceService: InterfaceService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.INTERFACE__CREATE,
    default: defaultInterfaceCreateData,
    title: 'Создать интерфейс',
  })
  @Post(InterfaceRoutesEnum.CREATE)
  create(@Body() dto: CreateInterfaceDto) {
    return this.interfaceService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.INTERFACE__GET_BY_CODE,
    default: defaultInterfaceGetByCodeData,
    title: 'Запросить интерфейс по коду',
  })
  @Get(InterfaceRoutesEnum.GET_BY_CODE)
  getByCode(
    @Query(InterfaceGetQueryParametersEnum.CODE, new CustomParseStringPipe()) code: string,
    @GetInterfaceFields() fields?: InterfaceField[]
  ) {
    return this.interfaceService.getByCode(code, { fields })
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.INTERFACE__UPDATE,
    default: defaultInterfaceUpdateData,
    title: 'Обновить интерфейс по коду',
  })
  @Patch(InterfaceRoutesEnum.UPDATE)
  update(@Body() dto: UpdateInterfaceDto) {
    return this.interfaceService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.INTERFACE__DELETE,
    default: defaultInterfaceDeleteData,
    title: 'Удалить интерфейс по id',
  })
  @Delete(InterfaceRoutesEnum.DELETE)
  delete(@MongoId('interfaceId') interfaceId: Types.ObjectId) {
    return this.interfaceService.delete(interfaceId)
  }
}

function GetInterfaceFields() {
  return Fields({ fieldsEnum: InterfaceFieldsEnum })
}
