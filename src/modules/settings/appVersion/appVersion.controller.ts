import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { AppVersionService } from './appVersion.service'
import { SetFeaturesDto } from './dto/setFeaturesDto'
import { OsPipe } from '../../../global/pipes/os.pipe'
import { AppVersionPipe } from '../../../global/pipes/appVersion.pipe'
import {
  AppVersionRoutesEnum,
  defaultAppVersionCheckData,
  defaultAppVersionCreateData,
  defaultAppVersionDeleteData,
  defaultAppVersionGetData,
  defaultAppVersionPostFeaturesData,
} from './appVersion.constants'
import { SetCurrentVersionDto } from './dto/setCurrentVersionDto'
import { DeleteVersionDto } from './dto/deleteVersionDto'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { OperationSystems } from '../../../global/enums/OS.enum'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.APP_VERSION__CREATE,
    default: defaultAppVersionCreateData,
    title: 'Установить версию приложения',
  })
  @Post(AppVersionRoutesEnum.CREATE)
  setCurrentVersion(@Body() dto: SetCurrentVersionDto) {
    return this.appVersionService.setCurrentVersion(dto.os, dto.version)
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.APP_VERSION__POST_FEATURES,
    default: defaultAppVersionPostFeaturesData,
    title: 'Установить фичи для версии',
  })
  @Patch(AppVersionRoutesEnum.PATCH_FEATURES)
  setFeatures(@Body() dto: SetFeaturesDto) {
    return this.appVersionService.setFeatures(dto.os, dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.APP_VERSION__CHECK,
    default: defaultAppVersionCheckData,
    title: 'Проверить версию приложения',
  })
  @Get(AppVersionRoutesEnum.CHECK)
  async check(@Query('os', new OsPipe()) os: OperationSystems, @Query('version', new AppVersionPipe()) version: string) {
    return this.appVersionService.get(os, version)
  }

  @Functionality({
    code: FunctionalityCodesEnum.APP_VERSION__GET,
    default: defaultAppVersionGetData,
    title: 'Получить версию приложения',
  })
  @Get('/')
  async get(@Query('os', new OsPipe()) os: OperationSystems) {
    return this.appVersionService.getCurrentVersion(os)
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.APP_VERSION__DELETE,
    default: defaultAppVersionDeleteData,
    title: 'Удалить версию приложения',
  })
  @Delete('/')
  deleteVersion(@Body() dto: DeleteVersionDto) {
    return this.appVersionService.deleteVersion(dto)
  }
}
