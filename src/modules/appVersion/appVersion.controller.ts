import { Body, Controller, Delete, Get, HttpStatus, Post } from '@nestjs/common'
import { AddAppVersionDto } from './dto/addAppVersion.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { RegExpQueryParam } from '../../global/decorators/RegExpQueryParam.decorator'
import { appVersionRegExp } from '../../global/regex'
import { AppVersionService } from './appVersion.service'
import { OperationSystem } from '../../global/enums/OS.enum'
import { EnumQueryParam } from '../../global/decorators/Enum.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { QueryOptions } from 'mongoose'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { AppVersionModuleGetVersionResponseDto } from './dto/responses/AppVersionModuleGetVersionResponse.dto'
import { AppVersionModuleGetFromVersionResponseDto } from './dto/responses/AppVersionModuleGetFromVersionResponse.dto'
import { AppVersionModuleCheckResponseDto } from './dto/responses/AppVersionModuleCheckResponse.dto'
import { UserAuth } from '../../global/decorators/UserAuth.decorator'

@ApiTags('Версия приложения')
@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @UserAuth({
    availability: 'appVersion',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description:
      'Эндпоинт позволяет добавить новую версию приложения. Если клиент запросить конкретное обновление или запрос список обновлений с какой-то версии, то ему вернётся обновление(или список), которые соответствуют запросу.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('/add')
  async addVersion(@Body() dto: AddAppVersionDto) {
    await this.appVersionService.create(dto)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить информацию по конкретной версии приложения.',
  })
  @ApiQuery({
    name: 'os',
    description: 'Операционная система, для которой нужно получить обновление.',
    example: OperationSystem.IOS,
    enum: OperationSystem,
  })
  @ApiQuery({
    name: 'version',
    description: `Версия, для которой нужно получить информацию. Версия должна соответствовать регулярному выражению ${appVersionRegExp}`,
    example: '2.0.1',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: AppVersionModuleGetVersionResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/')
  async getVersion(
    @EnumQueryParam('os', OperationSystem) os: OperationSystem,
    @RegExpQueryParam('version', appVersionRegExp) version: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      version: await this.appVersionService.getVersion(os, version, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список обновлений с информацией по ним, начиная(не включая переданную) с переданной версии.',
  })
  @ApiQuery({
    name: 'os',
    description: 'Операционная система, для которой нужно получить список обновлений.',
    example: OperationSystem.IOS,
    enum: OperationSystem,
  })
  @ApiQuery({
    name: 'version',
    description: `Версия, для которой нужно получить информацию. Версия должна соответствовать регулярному выражению ${appVersionRegExp}`,
    example: '2.0.1',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: AppVersionModuleGetFromVersionResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/from')
  async getFromVersion(
    @EnumQueryParam('os', OperationSystem) os: OperationSystem,
    @RegExpQueryParam('version', appVersionRegExp) version: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      versions: await this.appVersionService.getFromVersion(os, version, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет проверить есть ли обновление(т. е. более поздняя версия) для переданной версии.',
  })
  @ApiQuery({
    name: 'os',
    description: 'Операционная система, для которой нужно получить список обновлений.',
    example: OperationSystem.IOS,
    enum: OperationSystem,
  })
  @ApiQuery({
    name: 'version',
    description: `Версия, для которой нужно получить информацию. Версия должна соответствовать регулярному выражению ${appVersionRegExp}`,
    example: '2.0.1',
  })
  @ApiResponseException()
  @ApiResponse({
    type: AppVersionModuleCheckResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/check')
  async check(@EnumQueryParam('os', OperationSystem) os: OperationSystem, @RegExpQueryParam('version', appVersionRegExp) version: string) {
    return {
      haveUpdate: await this.appVersionService.checkUpdate(os, version),
    }
  }

  @UserAuth({
    availability: 'appVersion',
    availabilityKey: 'available',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет удалить версию приложения.',
  })
  @ApiQuery({
    name: 'os',
    description: 'Операционная система, для которой нужно получить список обновлений.',
    example: OperationSystem.IOS,
    enum: OperationSystem,
  })
  @ApiQuery({
    name: 'version',
    description: `Версия, для которой нужно получить информацию. Версия должна соответствовать регулярному выражению ${appVersionRegExp}`,
    example: '2.0.1',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@EnumQueryParam('os', OperationSystem) os: OperationSystem, @RegExpQueryParam('version', appVersionRegExp) version: string) {
    await this.appVersionService.delete(os, version)
  }
}
