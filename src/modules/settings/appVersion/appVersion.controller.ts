import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AppVersionService } from './appVersion.service'
import { SetFeaturesDto } from './dto/setFeaturesDto'
import { OSs } from '../../../global/constants/other.constants'
import { OsPipe } from '../../../global/pipes/os.pipe'
import { AppVersionPipe } from '../../../global/pipes/appVersion.pipe'
import { OwnerJwtAuthGuard } from '../../../global/guards/ownerJwtAuth.guard'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetAppVersionEnum } from './appVersion.constants'
import { SetCurrentVersionDto } from './dto/setCurrentVersionDto'
import { DeleteVersionDto } from './dto/deleteVersionDto'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  setCurrentVersion(@Body() dto: SetCurrentVersionDto) {
    return this.appVersionService.setCurrentVersion(dto.os, dto.version)
  }

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  setFeatures(@Body() dto: SetFeaturesDto) {
    return this.appVersionService.setFeatures(dto.os, dto)
  }

  @Get('/')
  async get(
    @Query('os', new OsPipe({ required: false })) os?: typeof OSs[number],
    @Query('version', new AppVersionPipe({ required: false })) version?: string
  ) {
    const request = checkAlternativeQueryParameters<GetAppVersionEnum>(
      { required: { os, version }, enum: GetAppVersionEnum.check },
      { required: { os }, enum: GetAppVersionEnum.get }
    )

    switch (request.enum) {
      case GetAppVersionEnum.get:
        return this.appVersionService.getCurrentVersion(request.os)
      case GetAppVersionEnum.check:
        return this.appVersionService.get(request.os, request.version)
    }
  }

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete('/')
  deleteVersion(@Body() dto: DeleteVersionDto) {
    return this.appVersionService.deleteVersion(dto)
  }
}
