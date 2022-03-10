import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { CreateAdminUserDto } from './dto/createAdminUser.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserService } from './adminUser.service'
import { UpdateAdminUserDto } from './dto/updateAdminUser.dto'
import { UpdatePasswordDto } from './dto/updatePassword.dto'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { INCORRECT_CREDENTIALS } from '../../global/constants/errors.constants'
import { Request, Response } from 'express'
import { AdminUserModel, TokenDataModel } from './adminUser.model'
import { addDays } from './date'
import { UpdateAvailabilityDto } from './dto/updateAvailability.dto'
import { removeFields } from '../../global/utils/removeFields'
import { DocumentType } from '@typegoose/typegoose'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'
import { UpdateUserSuperDto } from './dto/updateUserSuper.dto'
import { UpdateUserUltraSuperDto } from './dto/updateUserUltraSuper.dto'
import { ITokenData } from '../../global/types'
import { SuperAdminUserAuth } from '../../global/decorators/SuperAdminUserAuth.decorator'
import { UltraSuperAdminUserAuth } from '../../global/decorators/UltraSuperAdminUserAuth.decorator'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'

@ApiTags('Администраторы')
@Controller()
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService, private readonly jwtService: JwtService) {
    setInterval(async () => await this.adminUserService.deleteExpiredTokens(), 60000)
  }

  @WhitelistedValidationPipe()
  @UltraSuperAdminUserAuth()
  @ApiOperation({ description: 'Эндпоинт позволяет создать администратора' })
  @Post('/')
  async create(@Body() dto: CreateAdminUserDto) {
    return removeAdminUserFields(await this.adminUserService.create(dto), ['tokens', 'hashedPassword'])
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить администратора по его id' })
  @ApiMongoQueryOptions()
  @ApiQuery({
    name: 'adminUserId',
    description: 'id нужного администратора',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @Get('/by-id')
  async getById(@MongoId('adminUserIds') adminUserId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return removeAdminUserFields(await this.adminUserService.getById(adminUserId, queryOptions), ['tokens', 'hashedPassword'])
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить список администраторов по списку из id' })
  @ApiQuery({
    name: 'adminUserIds',
    description: 'Список id администраторов, которых нужно получить. id нужно перечислять через запятую',
    type: 'MongoId',
    isArray: true,
    example: '6203ce8cff1a854919f38314,6203ce8cff1a854919f38314',
  })
  @ApiMongoQueryOptions()
  @Get('/by-ids')
  async getByIds(
    @MongoId('adminUserIds', { multiple: true }) adminUserIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return removeAdminUserFields(await this.adminUserService.getByIds(adminUserIds, queryOptions), ['tokens', 'hashedPassword'])
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить список всех администраторов, основываясь на переданных параметрах.' })
  @ApiQuery({
    name: 'page',
    description: 'Страница. Значением параметра может быть только положительное число.',
    example: 1,
  })
  @ApiQuery({
    name: 'count',
    description: 'Количество получаемых пользователей. Значением параметра может быть только положительное число.',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description:
      'Строка, которая содержится в ФИО администраторов. Если параметр передан, то возвращается список только тех администраторов, у которых в ФИО содержится переданная строка. Параметр не чувствителен к регистру(Исл = исл).',
    example: 'Исл',
  })
  @ApiMongoQueryOptions()
  @Get('/many')
  async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('name', { required: false }) name?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      adminUsers: removeAdminUserFields(await this.adminUserService.getMany(page, count, name, queryOptions), ['tokens', 'hashedPassword']),
      count: await this.adminUserService.countMany(name),
    }
  }

  @ApiOperation({
    description:
      'Эндпоинт позволяет пройти авторизацию. Если аутентификация прошла успешно, то в cookie с именем access_token ложится токен доступа. После этого можно выполнять запросы на сервер.',
  })
  @WhitelistedValidationPipe()
  @Get('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    const adminUser = await this.adminUserService.getByLogin(dto.login, { projection: { _id: 1, hashedPassword: 1 } })

    if (await bcrypt.compare(dto.password, adminUser.hashedPassword)) {
      const tokenPayload: ITokenData = {
        id: adminUser.id,
      }
      const generatedToken = this.jwtService.sign(tokenPayload)
      const tokenExpiresDate = addDays(new Date(), 30)
      await this.adminUserService.addToken(adminUser.id, new TokenDataModel(generatedToken, tokenExpiresDate), {
        checkExistence: { adminUser: false },
      })
      response.cookie('access_token', generatedToken, { httpOnly: true, expires: tokenExpiresDate }).json({
        authorized: true,
      })
    } else throw new BadRequestException(INCORRECT_CREDENTIALS)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет проверить авторизован ли пользователь.',
  })
  @Get('/check-authorized')
  async checkAuthorized(@Req() request: Request) {
    const token = request.cookies['access_token']

    if (token) {
      const tokenData = this.jwtService.decode(token) as ITokenData

      return {
        authorized: await this.adminUserService.checkTokenExists(Types.ObjectId(tokenData.id), token),
      }
    } else {
      return {
        authorized: false,
      }
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет деавторизоваться. cookie исчезает, с БД удаляется токен.',
  })
  @Get('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['access_token'] as string | undefined
    if (token) {
      const tokenData = this.jwtService.decode(token) as ITokenData
      await this.adminUserService.deleteToken(Types.ObjectId(tokenData.id), token)
      response.clearCookie('access_token').json({
        authorized: false,
      })
    } else throw new UnauthorizedException()
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить информацию об администраторе. Доступен только если есть соответствующее разрешение.',
  })
  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateAdminUserDto) {
    await this.adminUserService.update(dto)
    return removeAdminUserFields(await this.adminUserService.getById(dto.id, undefined, { checkExistence: { adminUser: false } }), [
      'tokens',
      'hashedPassword',
    ])
  }

  @WhitelistedValidationPipe()
  @UltraSuperAdminUserAuth()
  @Patch('/super')
  async updateUserSuper(@Body() dto: UpdateUserSuperDto) {
    await this.adminUserService.updateUserSuper(dto.id, dto.isSuper)
    return removeAdminUserFields(await this.adminUserService.getById(dto.id, undefined, { checkExistence: { adminUser: false } }), [
      'tokens',
      'hashedPassword',
    ])
  }

  @WhitelistedValidationPipe()
  @UltraSuperAdminUserAuth()
  @Patch('/ultra-super')
  async updateUserUltraSuper(@Body() dto: UpdateUserUltraSuperDto) {
    await this.adminUserService.updateUserUltraSuper(dto.id, dto.isUltraSuper)
    return removeAdminUserFields(await this.adminUserService.getById(dto.id, undefined, { checkExistence: { adminUser: false } }), [
      'tokens',
      'hashedPassword',
    ])
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить пароль администратора. Доступен только если есть соответствующее разрешение.',
  })
  @WhitelistedValidationPipe()
  @Patch('/update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    await this.adminUserService.updatePassword(dto.login, dto.password)
    return {
      newPassword: dto.password,
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить разрешения администратора.',
  })
  @WhitelistedValidationPipe()
  @SuperAdminUserAuth()
  @Patch('/update-availability')
  async updateAvailability(@Body() dto: UpdateAvailabilityDto) {
    await this.adminUserService.updateAvailability(dto.id, dto.availability)
    return removeAdminUserFields(
      await this.adminUserService.getById(dto.id, { projection: { availability: 1 } }, { checkExistence: { adminUser: false } }),
      ['tokens', 'hashedPassword']
    )
  }

  @Delete('/')
  async deleteById(@MongoId('adminUserId') adminUserId: Types.ObjectId) {
    await this.adminUserService.deleteById(adminUserId)
  }
}

function removeAdminUserFields(
  data: DocumentType<AdminUserModel> | DocumentType<AdminUserModel>[],
  fieldsToRemove: (keyof AdminUserModel)[]
) {
  return removeFields<AdminUserModel>(data, fieldsToRemove)
}
