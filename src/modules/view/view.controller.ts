import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ViewService } from './view.service'
import { ViewAdditionalFieldsEnum, ViewField, ViewFieldsEnum, ViewGetQueryParametersEnum, ViewRoutesEnum } from './view.constants'
import { CreateViewDto } from './dto/createView.dto'
import { Fields } from '../../global/decorators/Fields.decorator'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { UpdateViewDto } from './dto/updateView.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { Types } from 'mongoose'
import normalizeFields from '../../global/utils/normalizeFields'

@Controller()
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @UsePipes(new ValidationPipe())
  @Post(ViewRoutesEnum.CREATE)
  create(@Body() dto: CreateViewDto) {
    return this.viewService.create(dto)
  }

  @Get(ViewRoutesEnum.GET_BY_CODE)
  getByCode(@Query(ViewGetQueryParametersEnum.CODE, new CustomParseStringPipe()) code: string, @ViewGetFields() fields?: ViewField[]) {
    return this.viewService.getByCode(code, { fields })
  }

  @Get(ViewRoutesEnum.GET_BY_USER_ID)
  async getByUserId(@MongoId(ViewGetQueryParametersEnum.USER_ID) userId: Types.ObjectId, @ViewGetFields() fields?: ViewField[]) {
    return normalizeFields(await this.viewService.getByUserId(userId, { fields }), { fields })
  }

  @UsePipes(new ValidationPipe())
  @Patch(ViewRoutesEnum.UPDATE)
  update(@Body() dto: UpdateViewDto) {
    return this.viewService.update(dto)
  }

  @Delete(ViewRoutesEnum.DELETE)
  delete(@MongoId('viewId') viewId: Types.ObjectId) {
    return this.viewService.delete(viewId)
  }
}

function ViewGetFields() {
  return Fields({ fieldsEnum: ViewFieldsEnum, additionalFieldsEnum: ViewAdditionalFieldsEnum })
}
