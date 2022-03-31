import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateUserDto } from '../dto/user/createUser.dto'
import { MongoId } from '../../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../../global/decorators/MongoQueryOptions.decorator'
import { UserService } from '../services/user.service'
import { UpdateUserDto } from '../dto/user/updateUser.dto'
import { UpdatePasswordDto } from '../dto/user/updatePassword.dto'
import { LoginDto } from '../dto/user/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { FORBIDDEN_CLIENT_INTERFACE, INCORRECT_CREDENTIALS, NOT_AUTHORIZED } from '../../../global/constants/errors.constants'
import { Request, Response } from 'express'
import { UserModel, TokenDataModel } from '../models/user.model'
import { addDays } from '../../../global/utils/date'
import { UpdateAvailabilityDto } from '../dto/user/updateAvailability.dto'
import { removeFields } from '../../../global/utils/removeFields'
import { DocumentType } from '@typegoose/typegoose'
import { WhitelistedValidationPipe } from '../../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../../global/decorators/StringQueryParam.decorator'
import { ITokenData } from '../../../global/types'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiMongoQueryOptions } from '../../../global/decorators/ApiMongoQueryOptions.decorator'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { UserModuleCreateResponseDto } from '../dto/user/responses/UserModuleCreateResponse.dto'
import { UserModuleGetByIdResponseDto } from '../dto/user/responses/UserModuleGetByIdResponse.dto'
import { UserModuleGetByIdsResponseDto } from '../dto/user/responses/UserModuleGetByIdsResponse.dto'
import { UserModuleGetManyResponseDto } from '../dto/user/responses/UserModuleGetManyResponse.dto'
import { UserModuleCheckAuthorizedResponseDto } from '../dto/user/responses/UserModuleCheckAuthorizedResponse.dto'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'
import { UpdateRolesDto } from '../dto/user/updateRoles.dto'

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
    setInterval(async () => await this.userService.deleteExpiredTokens(), 60000)
  }

  @WhitelistedValidationPipe()
  @ApiOperation({ description: 'Эндпоинт позволяет создать пользователя' })
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleCreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateUserDto) {
    return {
      user: removeUserFields(await this.userService.create(dto), ['tokens', 'hashedPassword']),
    }
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить пользователя по его id' })
  @ApiMongoQueryOptions()
  @ApiQuery({
    name: 'userId',
    description: 'id нужного пользователя',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetByIdResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getById(@MongoId('userId') userId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      user: removeUserFields(await this.userService.getById(userId, queryOptions), ['tokens', 'hashedPassword']),
    }
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить список пользователей по списку их id' })
  @ApiQuery({
    name: 'userIds',
    description: 'Список id пользователей, которых нужно получить. id нужно перечислять через запятую',
    type: 'MongoId',
    isArray: true,
    example: '6203ce8cff1a854919f38314,6203ce8cff1a854919f38314',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetByIdsResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-ids')
  async getByIds(@MongoId('userIds', { multiple: true }) userIds: Types.ObjectId[], @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      users: removeUserFields(await this.userService.getByIds(userIds, queryOptions), ['tokens', 'hashedPassword']),
    }
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить список всех пользователей, основываясь на переданных параметрах.' })
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
      'Строка, которая содержится в ФИО пользователя. Если параметр передан, то возвращается список только тех пользователей, у которых в ФИО содержится переданная строка. Параметр не чувствителен к регистру(Исл = исл).',
    example: 'Исл',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetManyResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/many')
  async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('name', { required: false }) name?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      users: removeUserFields(await this.userService.getMany(page, count, name, queryOptions), ['tokens', 'hashedPassword']),
      count: await this.userService.countMany(name),
    }
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description:
      'Эндпоинт позволяет пройти авторизацию. Если аутентификация прошла успешно, то в cookie с именем access_token ложится токен доступа. После этого можно выполнять запросы на сервер.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('/login')
  async login(@Body() dto: LoginDto, @Res() response: Response) {
    const user = await this.userService.getByLogin(dto.login, { projection: { _id: 1, hashedPassword: 1, interfaces: 1 } })

    if (!user.interfaces.includes(dto.interface)) throw new BadRequestException(FORBIDDEN_CLIENT_INTERFACE)
    if (await bcrypt.compare(dto.password, user.hashedPassword)) {
      const tokenPayload: ITokenData = {
        id: user.id,
      }
      const generatedToken = this.jwtService.sign(tokenPayload)
      const tokenExpiresDate = addDays(new Date(), 30)
      await this.userService.addToken(user.id, new TokenDataModel(generatedToken, tokenExpiresDate), {
        checkExistence: { user: false },
      })
      response.cookie('access_token', generatedToken, { httpOnly: true, expires: tokenExpiresDate }).json()
    } else throw new BadRequestException(INCORRECT_CREDENTIALS)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет проверить авторизован ли пользователь.',
  })
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleCheckAuthorizedResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/check-authorized')
  async checkAuthorized(@Req() request: Request) {
    const token = request.cookies['access_token']

    if (token) {
      const tokenData = this.jwtService.decode(token) as ITokenData

      return {
        authorized: await this.userService.checkTokenExists(Types.ObjectId(tokenData.id), token),
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
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['access_token'] as string | undefined
    if (token) {
      const tokenData = this.jwtService.decode(token) as ITokenData
      await this.userService.deleteToken(Types.ObjectId(tokenData.id), token)
      response.clearCookie('access_token').json()
    } else throw new UnauthorizedException(NOT_AUTHORIZED)
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить информацию о пользователе. Доступен только если есть соответствующее разрешение.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateUserDto) {
    await this.userService.update(dto)
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить пароль пользователя. Доступен только если есть соответствующее разрешение.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    await this.userService.updatePassword(dto.login, dto.password)

    const user = await this.userService.getByLogin(dto.login, { projection: { tokens: 1 } }, { checkExistence: { user: false } })
    for await (const token of user.tokens) {
      await this.userService.deleteToken(user.id, (token as TokenDataModel).token, { checkExistence: { user: false } })
    }
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить разрешения пользователя.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/update-availability')
  async updateAvailability(@Body() dto: UpdateAvailabilityDto) {
    await this.userService.updateAvailability(dto.id, dto.availability)
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить роли пользователя.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/update-roles')
  async updateRoles(@Body() dto: UpdateRolesDto) {
    await this.userService.updateRoles(dto)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет удалить пользователя',
  })
  @ApiQuery({
    name: 'userId',
    description: 'id удаляемого пользователя',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async deleteById(@MongoId('userId') userId: Types.ObjectId) {
    await this.userService.deleteById(userId)
  }
}

function removeUserFields(data: DocumentType<UserModel> | DocumentType<UserModel>[], fieldsToRemove: (keyof UserModel)[]) {
  return removeFields<UserModel>(data, fieldsToRemove)
}