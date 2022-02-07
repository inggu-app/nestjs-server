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
import { ITokenData } from '../../global/guards/adminUserAuth.guard'
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

@Controller()
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService, private readonly jwtService: JwtService) {
    setInterval(async () => await this.adminUserService.deleteExpiredTokens(), 60000)
  }

  @WhitelistedValidationPipe()
  @Post('/')
  create(@Body() dto: CreateAdminUserDto) {
    return this.adminUserService.create(dto)
  }

  @Get('/by-id')
  async getById(@MongoId('adminUserId') adminUserId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return removeAdminUserFields(await this.adminUserService.getById(adminUserId, queryOptions), ['tokens', 'hashedPassword'])
  }

  @Get('/by-ids')
  async getByIds(
    @MongoId('adminUserIds', { multiple: true }) adminUserIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return removeAdminUserFields(await this.adminUserService.getByIds(adminUserIds, queryOptions), ['tokens', 'hashedPassword'])
  }

  @Get('/many')
  async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('page', { intType: 'positive' }) count: number,
    @StringQueryParam('name', { required: false }) name?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      adminUsers: removeAdminUserFields(await this.adminUserService.getMany(page, count, name, queryOptions), ['tokens', 'hashedPassword']),
      count: await this.adminUserService.countMany(name),
    }
  }

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

  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateAdminUserDto) {
    await this.adminUserService.update(dto)
    return this.adminUserService.getById(Types.ObjectId(dto.id), undefined, { checkExistence: { adminUser: false } })
  }

  @WhitelistedValidationPipe()
  @Patch('/update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto) {
    await this.adminUserService.updatePassword(dto.login, dto.password)
    return {
      newPassword: dto.password,
    }
  }

  @WhitelistedValidationPipe()
  @Patch('/update-availability')
  async updateAvailability(@Body() dto: UpdateAvailabilityDto) {
    await this.adminUserService.updateAvailability(Types.ObjectId(dto.id), dto.availability)
    return this.adminUserService.getById(
      Types.ObjectId(dto.id),
      { projection: { availability: 1 } },
      { checkExistence: { adminUser: false } }
    )
  }

  @Delete('/')
  async deleteById(@MongoId('adminUserId') adminUserId: Types.ObjectId) {
    await this.adminUserService.deleteById(adminUserId)
    return
  }
}

function removeAdminUserFields(
  data: DocumentType<AdminUserModel> | DocumentType<AdminUserModel>[],
  fieldsToRemove: (keyof AdminUserModel)[]
) {
  return removeFields<AdminUserModel>(data, fieldsToRemove)
}
