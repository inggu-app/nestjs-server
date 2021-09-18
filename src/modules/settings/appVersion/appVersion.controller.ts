import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AppVersionService } from './appVersion.service'
import { CreateAppVersionDto } from './dto/createAppVersion.dto'
import { OSs } from '../../../global/constants/other.constants'
import { OsPipe } from '../../../global/pipes/os.pipe'
import { AppVersionPipe } from '../../../global/pipes/appVersion.pipe'
import { checkAppVersion } from './appVersion.utils'
import { OwnerJwtAuthGuard } from '../../../global/guards/ownerJwtAuth.guard'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetAppVersionEnum } from './appVersion.constants'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createAppVersion(@Body() dto: CreateAppVersionDto) {
    await this.appVersionService.deleteActiveAppVersion()

    return this.appVersionService.createAppVersion(dto)
  }

  @Get('/')
  async get(
    @Query('os', new OsPipe({ required: false })) os?: typeof OSs[number],
    @Query('version', new AppVersionPipe({ required: false })) version?: string
  ) {
    const request = checkAlternativeQueryParameters<GetAppVersionEnum>(
      { required: { os, version }, enum: GetAppVersionEnum.check },
      { enum: GetAppVersionEnum.get }
    )

    switch (request.enum) {
      case GetAppVersionEnum.get:
        return this.appVersionService.getActiveAppVersion()
      case GetAppVersionEnum.check:
        const osVersions = await this.appVersionService.getActiveAppVersion()

        return {
          isHaveUpdate: osVersions
            ? checkAppVersion(
                request.os === 'android' ? osVersions.androidVersion : osVersions.iosVersion,
                request.version
              )
            : false,
        }
    }
  }
}
