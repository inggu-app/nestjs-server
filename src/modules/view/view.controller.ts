import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ViewService } from './view.service'
import {
  defaultViewCreateData,
  defaultViewDeleteData,
  defaultViewGetByCodeData,
  defaultViewGetByUserIdData,
  defaultViewUpdateData,
  ViewAdditionalFieldsEnum,
  ViewField,
  ViewFieldsEnum,
  ViewGetQueryParametersEnum,
  ViewRoutesEnum,
} from './view.constants'
import { CreateViewDto } from './dto/createView.dto'
import { Fields } from '../../global/decorators/Fields.decorator'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { UpdateViewDto } from './dto/updateView.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { Types } from 'mongoose'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

@Controller()
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.VIEW__CREATE,
    default: defaultViewCreateData,
    title: 'Создать отображение',
  })
  @Post(ViewRoutesEnum.CREATE)
  create(@Body() dto: CreateViewDto) {
    return this.viewService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.VIEW__GET_BY_CODE,
    default: defaultViewGetByCodeData,
    title: 'Получить отображение по коду',
  })
  @Get(ViewRoutesEnum.GET_BY_CODE)
  getByCode(@Query(ViewGetQueryParametersEnum.CODE, new CustomParseStringPipe()) code: string, @ViewGetFields() fields?: ViewField[]) {
    return this.viewService.getByCode(code, { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.VIEW__GET_BY_USER_ID,
    default: defaultViewGetByUserIdData,
    title: 'Получить список отображение для пользователя',
  })
  @Get(ViewRoutesEnum.GET_BY_USER_ID)
  async getByUserId(
    @MongoId(ViewGetQueryParametersEnum.USER_ID) userId: Types.ObjectId,
    @Query(ViewGetQueryParametersEnum.INTERFACE) intrfc?: string,
    @ViewGetFields() fields?: ViewField[]
  ) {
    return normalizeFields(await this.viewService.getByUserId(userId, intrfc, { fields }), { fields })
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.VIEW__UPDATE,
    default: defaultViewUpdateData,
    title: 'Обновить отображение',
  })
  @Patch(ViewRoutesEnum.UPDATE)
  update(@Body() dto: UpdateViewDto) {
    return this.viewService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.VIEW__DELETE,
    default: defaultViewDeleteData,
    title: 'Удалить отображение',
  })
  @Delete(ViewRoutesEnum.DELETE)
  delete(@MongoId('viewId') viewId: Types.ObjectId) {
    return this.viewService.delete(viewId)
  }
}

function ViewGetFields() {
  return Fields({ fieldsEnum: ViewFieldsEnum, additionalFieldsEnum: ViewAdditionalFieldsEnum })
}
