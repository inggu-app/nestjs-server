import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { AppVersionService } from './appVersion.service'
import { SetFeaturesDto } from './dto/setFeaturesDto'
import { OsPipe } from '../../../global/pipes/os.pipe'
import { AppVersionPipe } from '../../../global/pipes/appVersion.pipe'
import { AppVersionRoutesEnum } from './appVersion.constants'
import { SetCurrentVersionDto } from './dto/setCurrentVersionDto'
import { DeleteVersionDto } from './dto/deleteVersionDto'
import { OperationSystems } from '../../../global/enums/OS.enum'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Версия приложения')
@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @UsePipes(new ValidationPipe())
  @Post(AppVersionRoutesEnum.CREATE)
  setCurrentVersion(@Body() dto: SetCurrentVersionDto) {
    return this.appVersionService.setCurrentVersion(dto.os, dto.version)
  }

  @UsePipes(new ValidationPipe())
  @Patch(AppVersionRoutesEnum.PATCH_FEATURES)
  setFeatures(@Body() dto: SetFeaturesDto) {
    return this.appVersionService.setFeatures(dto.os, dto)
  }

  @Get(AppVersionRoutesEnum.CHECK)
  async check(@Query('os', new OsPipe()) os: OperationSystems, @Query('version', new AppVersionPipe()) version: string) {
    return this.appVersionService.get(os, version)
  }

  @Get('/')
  async get(@Query('os', new OsPipe()) os: OperationSystems) {
    return this.appVersionService.getCurrentVersion(os)
  }

  @UsePipes(new ValidationPipe())
  @Delete('/')
  deleteVersion(@Body() dto: DeleteVersionDto) {
    return this.appVersionService.deleteVersion(dto)
  }
}
