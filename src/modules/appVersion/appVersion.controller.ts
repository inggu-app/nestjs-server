import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { AddAppVersionDto } from './dto/addAppVersion.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { RegExp } from '../../global/decorators/RegExp.decorator'
import { appVersionRegExp } from '../../global/regex'
import { AppVersionService } from './appVersion.service'
import { OperationSystem } from '../../global/enums/OS.enum'
import { Enum } from '../../global/decorators/Enum.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { QueryOptions } from 'mongoose'

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @WhitelistedValidationPipe()
  @Post('/add')
  async addVersion(@Body() dto: AddAppVersionDto) {
    await this.appVersionService.create(dto)
  }

  @Get('/')
  getVersion(
    @Enum('os', OperationSystem) os: OperationSystem,
    @RegExp('version', appVersionRegExp) version: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return this.appVersionService.getVersion(os, version, queryOptions)
  }

  @Get('/from')
  async getFromVersion(
    @Enum('os', OperationSystem) os: OperationSystem,
    @RegExp('version', appVersionRegExp) version: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      versions: await this.appVersionService.getFromVersion(os, version, queryOptions),
    }
  }

  @Get('/check')
  async check(@Enum('os', OperationSystem) os: OperationSystem, @RegExp('version', appVersionRegExp) version: string) {
    return {
      haveUpdate: await this.appVersionService.checkUpdate(os, version),
    }
  }

  @Delete('/')
  async delete(@Enum('os', OperationSystem) os: OperationSystem, @RegExp('version', appVersionRegExp) version: string) {
    await this.appVersionService.delete(os, version)
  }
}
