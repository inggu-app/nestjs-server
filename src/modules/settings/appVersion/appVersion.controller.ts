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
import { AdminJwtAuthGuard } from '../../../global/guards/adminJwtAuth.guard'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get('/get')
  getAppVersion() {
    return this.appVersionService.getActiveAppVersion()
  }

  @Get('/check')
  async checkAppVersion(
    @Query('os', OsPipe) os: typeof OSs[number],
    @Query('version', AppVersionPipe) version: string
  ) {
    const osVersions = await this.appVersionService.getActiveAppVersion()

    if (os === 'android' && osVersions) {
      return {
        isHaveUpdate: checkAppVersion(osVersions.androidVersion, version),
      }
    } else if (os === 'ios' && osVersions) {
      return {
        isHaveUpdate: checkAppVersion(osVersions.iosVersion, version),
      }
    } else {
      return {
        isHaveUpdate: false,
      }
    }
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createAppVersion(@Body() dto: CreateAppVersionDto) {
    await this.appVersionService.deleteActiveAppVersion()

    return this.appVersionService.createAppVersion(dto)
  }
}
