import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AppVersionService } from './appVersion.service'
import { CreateAppVersionDto } from './dto/createAppVersion.dto'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get('/get')
  getAppVersion() {
    return this.appVersionService.getActiveAppVersion()
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createAppVersion(@Body() dto: CreateAppVersionDto) {
    await this.appVersionService.deleteActiveAppVersion()

    return this.appVersionService.createAppVersion(dto)
  }
}
