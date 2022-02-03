import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { InterfaceService } from './interface.service'
import {
  defaultInterfaceCreateData,
  defaultInterfaceDeleteData,
  defaultInterfaceGetByCodeData,
  defaultInterfaceUpdateData,
  InterfaceGetQueryParametersEnum,
  InterfaceRoutesEnum,
} from './interface.constants'
import { CreateInterfaceDto } from './dto/createInterface.dto'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { UpdateInterfaceDto } from './dto/updateInterface.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ApiTags } from '@nestjs/swagger'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'

@ApiTags('Интерфейсы')
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
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return this.interfaceService.getByCode(code, { queryOptions })
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
